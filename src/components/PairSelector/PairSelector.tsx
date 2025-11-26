import {useMemo, useState} from 'react';
import styles from './PairSelector.module.css';
import ArrowBottomImage from '../../assets/arrow-bottom.svg'
import BtcImage from '../../assets/btc.svg'
import type {IPairSelectorProps} from "./types.ts";


export function PairSelector({ pairs, selectedPairId, onChange }: IPairSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = useMemo(() => pairs.find(
    (pair) => pair.id === selectedPairId) ?? pairs[0] ?? null,
    [pairs, selectedPairId]
  );

  if (!selected) return null;

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className={styles.pairRow}>
      <button
        type="button"
        className={styles.pairButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={styles.pairMain}>
          <img src={BtcImage} alt={'currency'}/>
          <span className={styles.pairLabel}>{selected.label}</span>
          <span className={styles.pairLeverage}>{selected.leverage}</span>
        </div>
        <img className={styles.pairChevron} src={ArrowBottomImage} alt="arrow bottom" />
      </button>

      {isOpen && (
        <div className={styles.pairDropdown}>
          {pairs.map((pair) => (
            <button
              key={pair.id}
              type="button"
              className={styles.pairDropdownItem}
              data-active={pair.id === selected.id}
              onClick={() => handleSelect(pair.id)}
            >
              <span>{pair.label}</span>
              <span className={styles.pairDropdownLeverage}>{pair.leverage}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
