import styles from './Navigation.module.css'
import TradeIcon from '../../assets/trade.svg'
import PositionsIcon from '../../assets/positions.svg'
import RewardsIcon from '../../assets/rewards.svg'
import ProfileIcon from '../../assets/profile.svg'
import clsx from "clsx";

export const Navigation = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.menuItem}>
        <img src={TradeIcon} alt={'trade'}/>
        <p className={clsx(styles.activeMenuTitle, styles.menuTitle)}>Trade</p>
      </div>
      <div className={styles.menuItem}>
        <img src={PositionsIcon} alt={'positions'}/>
        <p className={styles.menuTitle}>Positions</p>
      </div>
      <div className={styles.menuItem}>
        <img src={RewardsIcon} alt={'rewards'}/>
        <p className={styles.menuTitle}>Rewards</p>
        <span className={styles.indicator}>345,29k</span>
      </div>
      <div className={styles.menuItem}>
        <img src={ProfileIcon} alt={'profile'}/>
        <p className={styles.menuTitle}>Profile</p>
      </div>
    </div>
  );
};