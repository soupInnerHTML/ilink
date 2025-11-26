import styles from './SliderDots.module.css';

type Props = {
  total?: number;
  activeIndex?: number;
};

export function SliderDots({ total = 5, activeIndex = 0 }: Props) {
  return (
    <div className={styles.sliderDots}>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={styles.dot}
          data-active={index === activeIndex}
        />
      ))}
    </div>
  );
}
