import { component$ } from '@builder.io/qwik';
import styles from './trades.module.css';

type TradesProps = {
  level: number;
  initialValue: number | null;
  trades: number;
};

export const Trades = component$((props: TradesProps) => {
  const { level, trades, initialValue } = props;

  return (
    <div class={styles.trades}>
      <h2>Double your value in 5 trades 📈</h2>
      {initialValue && (
        <div class={styles.bobelContainer}>
          <span class={styles.value}>{initialValue.toFixed(2)} $</span>
          <span class={styles.tradeBobel}>
            <span class={trades >= 0 && styles.active} />
            <span class={trades >= 1 && styles.active} />
            <span class={trades >= 2 && styles.active} />
            <span class={trades >= 3 && styles.active} />
            <span class={trades >= 4 && styles.active} />
          </span>
          <span class={styles.value}>{(initialValue * 2).toFixed(2)} $</span>
        </div>
      )}
      <div>Level {level + 1}</div>
    </div>
  );
});
