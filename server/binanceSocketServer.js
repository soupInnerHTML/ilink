import http from 'node:http';
import { Server } from 'socket.io';
import WebSocket from 'ws';

const PORT = 4000
const SYMBOL = 'btcusdc';
const HISTORY_LIMIT = Number(process.env.BINANCE_HISTORY_POINTS ?? 60);

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const minuteHistory = [];
let pendingBucket = null;

async function loadInitialHistory() {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${SYMBOL.toUpperCase()}&interval=1m&limit=${HISTORY_LIMIT}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Binance history request failed: ${response.status}`);
    }
    const klines = await response.json();
    minuteHistory.splice(
      0,
      minuteHistory.length,
      ...klines
        .map((entry) => ({
          time: Number(entry[0]),
          price: Number(entry[4]),
        }))
        .filter((point) => Number.isFinite(point.price)),
    );
    pendingBucket = minuteHistory.pop() ?? null;
    console.log(`Loaded ${minuteHistory.length} historical 1m points`);
  } catch (error) {
    console.error('Failed to load Binance history', error);
  }
}

function emitLatestHistory(socket) {
  if (minuteHistory.length) {
    socket.emit('binance-history', minuteHistory);
  }
}

function broadcastNewMinute(point) {
  if (!point) return;
  minuteHistory.push(point);
  if (minuteHistory.length > HISTORY_LIMIT) {
    minuteHistory.shift();
  }
  io.emit('binance-minute', point);
}

function handleTrade(price, time) {
  if (!Number.isFinite(price) || !Number.isFinite(time)) return;
  const bucketTime = Math.floor(time / 60000) * 60000;

  if (!pendingBucket) {
    pendingBucket = { price, time: bucketTime };
    return;
  }

  if (bucketTime === pendingBucket.time) {
    pendingBucket.price = price;
    return;
  }

  // catch up for missed minutes
  let cursor = pendingBucket.time;
  while (cursor < bucketTime) {
    broadcastNewMinute({ time: cursor, price: pendingBucket.price });
    cursor += 60000;
  }

  pendingBucket = { price, time: bucketTime };
}

function startBinanceStream() {
  const endpoint = `wss://stream.binance.com:9443/ws/${SYMBOL}@trade`;
  const stream = new WebSocket(endpoint);

  stream.on('open', () => {
    console.log(`Connected to Binance ${SYMBOL} stream`);
  });

  stream.on('message', (message) => {
    try {
      const payload = JSON.parse(message.toString());
      const price = Number(payload.p);
      const tradeTime = Number(payload.T);

      handleTrade(price, tradeTime);

      io.emit('binance-trade', {
        price,
        quantity: Number(payload.q),
        time: tradeTime,
      });
    } catch (error) {
      console.error('Failed to parse Binance payload', error);
    }
  });

  stream.on('close', () => {
    console.warn('Binance stream closed. Reconnecting...');
    setTimeout(startBinanceStream, 1500);
  });

  stream.on('error', (error) => {
    console.error('Binance stream error', error);
    stream.close();
  });
}

io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);
  emitLatestHistory(socket);
  if (pendingBucket) {
    socket.emit('binance-minute', pendingBucket);
  }
  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

await loadInitialHistory();
startBinanceStream();

httpServer.listen(PORT, () => {
  console.log(`Binance socket bridge listening on :${PORT}`);
});

