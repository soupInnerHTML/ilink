import styles from './TradeComments.module.css';

const COMMENTS = [
  {
    id: 1,
    name: 'Dany',
    time: 'Today at 12:32',
    text: 'Opened Long 10X',
    color: 'rgba(151, 252, 166, 1)',
  },
  {
    id: 2,
    name: 'Gabriel',
    time: 'Today at 12:45',
    text: 'Opened Short 100X',
    color: 'rgba(255, 128, 0, 1)'
  },
];

export function TradeComments() {
  return (
    <div className={styles.container}>
      {COMMENTS.map((item) => (
        <div key={item.id} className={styles.row}>
          <div className={styles.meta}>
            <span className={styles.name} style={{color: item.color}}>
              {item.name}
            </span>
            <span className={styles.time}>{item.time}</span>
          </div>
          <p className={styles.text}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
