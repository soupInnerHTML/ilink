import styles from './PositionPanel.module.css';
import ArrowBottomIcon from '../../assets/arrow-bottom.svg'

export function PositionPanel() {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <span className={styles.title}>Position details</span>
        <div className={styles.tags}>
          <span className={styles.tag}>Margin $10</span>
          <span className={styles.tag}>Leverage 10x</span>
          <img src={ArrowBottomIcon} alt={'arrow bottom'} />
        </div>
      </div>

      <div className={styles.buttonsRow}>
        <button type="button" className={styles.longButton}>
          Long
        </button>
        <button type="button" className={styles.shortButton}>
          Short
        </button>
      </div>
    </div>
  );
}
