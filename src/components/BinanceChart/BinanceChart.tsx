import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './BinanceChart.module.css';
import { CustomizedLabel } from '../CustomizedLabel/CustomizedLabel.tsx';
import clsx from 'clsx';
import { TradeComments } from '../TradeComments/TradeComments';

type MinutePoint = {
  price?: number;
  time?: number;
};

const SOCKET_URL = 'http://localhost:4000';
const MAX_POINTS = 60;

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const axisFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function BinanceChart() {
  const [prices, setPrices] = useState<MinutePoint[]>([]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('binance-history', (history: MinutePoint[] = []) => {
      setPrices(history.slice(-MAX_POINTS));
    });

    socket.on('binance-minute', (payload: MinutePoint) => {
      const price = Number(payload.price);
      const time = Number(payload.time);
      if (!Number.isFinite(price) || !Number.isFinite(time)) return;

      setPrices((prev) => {
        const next = [...prev, { price, time }];
        if (next.length > MAX_POINTS) {
          next.splice(0, next.length - MAX_POINTS);
        }
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = useMemo(
    () =>
      prices.map((point) => {
        const date = new Date(point.time ?? Date.now());
        return {
          price: point.price,
          time: point.time,
          label: date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          tooltipLabel: date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }),
    [prices],
  );

  const lastPrice = prices.at(-1)?.price ?? 0;
  const firstPrice = prices[0]?.price ?? null;
  const priceDelta =
    lastPrice && firstPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
  const minPrice = useMemo(() => {
    const finitePrices = prices
      .map((point) => Number(point.price))
      .filter((value) => Number.isFinite(value));
    if (!finitePrices.length) return null;
    return Math.min(...finitePrices);
  }, [prices]);

  const formatedPrice = priceFormatter.format(lastPrice)

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.priceInfo}>
          <p className={styles.price}>
            {formatedPrice.slice(0, -3)}
            <span className={styles.priceFloatPart}>{formatedPrice.slice(-3)}</span>
          </p>
          <span
            className={styles.delta}
            data-positive={priceDelta >= 0}
          >{`${priceDelta >= 0 ? '+' : ''}${priceDelta.toFixed(2)}%`}</span>
        </div>

        <button className={clsx(styles.button, styles.like)} />
        <button className={clsx(styles.button, styles.settings)} />
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.chart}>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="rgba(236, 189, 117, 0.1)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="88.3%"
                      stopColor="rgba(236, 189, 117, 0)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  minTickGap={20}
                />
                <YAxis
                  dataKey="price"
                  orientation="right"
                  tickFormatter={(value) => axisFormatter.format(value)}
                  tick={{
                    fill: 'rgba(255,255,255,0.55)',
                    fontSize: 10,
                    dx: 6,
                  }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  width={60}
                  domain={
                    Number.isFinite(minPrice ?? NaN)
                      ? [Math.floor((minPrice as number) * 0.999), 'auto']
                      : ['auto', 'auto']
                  }
                />
                <Tooltip
                  contentStyle={{
                    background: '#111317',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                  labelFormatter={(label, payload) =>
                    (payload?.[0]?.payload as { tooltipLabel?: string })
                      ?.tooltipLabel ?? String(label)
                  }
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                />
                <Area
                  type="linear"
                  dataKey="price"
                  stroke="rgba(236, 189, 117, 1)"
                  strokeWidth={2.6}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="url(#priceGradient)"
                  isAnimationActive={true}
                  animationDuration={500}
                />
                <ReferenceLine
                  y={lastPrice}
                  stroke="#97FCA6"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  label={<CustomizedLabel label={lastPrice} />}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.empty}>Ждем котировки Binance…</div>
          )}
        </div>

        <div className={styles.commentsOverlay}>
          <TradeComments />
        </div>
      </div>
    </div>
  );
}

