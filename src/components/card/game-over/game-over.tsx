import { component$ } from '@builder.io/qwik';
import styles from './game-over.module.css';

type GameOverProps = {
  level: number;
  highestValue: number;
};

export const GameOver = component$((props: GameOverProps) => {
  const { level, highestValue } = props;
  return (
    <div class={styles.container}>
      <h2>Game Over</h2>
      <h3>
        Level {level + 1} with the highest value of{' '}
        <span class={styles.value}>{highestValue.toFixed(2)} $</span>
      </h3>
    </div>
  );
});
