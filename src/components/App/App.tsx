import { useState } from 'react';
import { ConnectButton } from '../ConnectButton';
import { BinanceChart } from '../BinanceChart';
import { IntervalTabs } from '../IntervalTabs';
import { PositionPanel } from '../PositionPanel';
import { PairSelector, type ITradingPair } from '../PairSelector';
import { SliderDots } from '../SliderDots';
import styles from './App.module.css';
import {Navigation} from "../Navigation";

const TRADING_PAIRS: ITradingPair[] = [
  { id: 'btcdegen', label: 'BTCDEGEN/USDC', leverage: '100x' },
  { id: 'btc', label: 'BTC/USDC', leverage: '50x' },
  { id: 'eth', label: 'ETH/USDC', leverage: '50x' },
];

function App() {
  const [selectedPairId, setSelectedPairId] = useState(TRADING_PAIRS[0].id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <PairSelector
          pairs={TRADING_PAIRS}
          selectedPairId={selectedPairId}
          onChange={setSelectedPairId}
        />
        <ConnectButton />
      </div>
      <BinanceChart />
      <IntervalTabs />
      <div className={styles.bottomBar}>
        <SliderDots total={5} activeIndex={0} />
        <PositionPanel />
        <Navigation />
      </div>
    </div>
  );
}

export default App;
