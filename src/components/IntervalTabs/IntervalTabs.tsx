import { useState } from 'react';
import styles from './IntervalTabs.module.css';

const INTERVALS = ['15S', '1M', '1H', '1D'] as const;
const SLIDES_COUNT = 5;
export type IntervalValue = (typeof INTERVALS)[number];

type Props = {
  value?: IntervalValue;
  onChange?: (value: IntervalValue) => void;
};

export function IntervalTabs({ value, onChange }: Props) {
  const [internalValue, setInternalValue] = useState<IntervalValue>('1M');

  const current = value ?? internalValue;

  const handleClick = (next: IntervalValue) => {
    if (!value) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabsRow}>
        {INTERVALS.map((interval) => (
          <button
            key={interval}
            type="button"
            className={styles.tab}
            data-active={interval === current}
            onClick={() => handleClick(interval)}
          >
            {interval}
          </button>
        ))}
      </div>
    </div>
  );
}
