import {
  Resource,
  component$,
  useResource$,
  useStore,
  $,
  useTask$,
} from '@builder.io/qwik';
import {
  Card,
  type CardProps,
  getRandomCardData,
  CardDummy,
} from '~/components/card/card';
import { Trades } from '~/components/trades/trades';
import styles from './index.module.css';
import { GameOver } from '~/components/card/game-over/game-over';

export type GameStore = {
  level: number;
  trades: number;
  initialValue: number;
  highestValue: number;
  currentCard: CardProps | null;
  shuffle: number;
  gameOver: boolean;
};

export default component$(() => {
  const initialPrice = Math.random() * 0.5 + 4.5;
  const gameStore = useStore<GameStore>(
    {
      level: 0,
      trades: 0,
      initialValue: initialPrice,
      highestValue: initialPrice,
      currentCard: null,
      shuffle: Math.random() - 0.5,
      gameOver: false,
    },
    { deep: false }
  );

  useTask$(async ({ track }) => {
    track(() => gameStore.gameOver === false);
    const card = await getRandomCardData(gameStore.initialValue);
    gameStore.currentCard = card;
    gameStore.initialValue = card.price;
  });

  const optionA = useResource$<CardProps>(async ({ track }) => {
    track(() => !gameStore.gameOver && gameStore.currentCard);
    return getRandomCardData(
      (gameStore.currentCard?.price ?? gameStore.initialValue) * 1.5
    );
  });

  const optionB = useResource$<CardProps>(async ({ track }) => {
    track(() => !gameStore.gameOver && gameStore.currentCard);
    return getRandomCardData(
      (gameStore.currentCard?.price ?? gameStore.initialValue) * 0.5
    );
  });

  const handleTrade = $((option: CardProps) => {
    gameStore.trades++;
    gameStore.shuffle = Math.random() - 0.5;

    // update highestValue
    if (option.price > gameStore.highestValue) {
      gameStore.highestValue = option.price;
    }
    // check winning condition
    if (option.price >= gameStore.initialValue * 2) {
      gameStore.level++;
      gameStore.initialValue = option.price;
      gameStore.trades = 0;
    }
    // check loosing condition
    if (gameStore.trades >= 4) {
      gameStore.gameOver = true;
    } else {
      gameStore.currentCard = option;
    }
  });

  const handleReset = $(() => {
    const initialPrice = Math.random() * 0.5 + 4.5;
    gameStore.level = 0;
    gameStore.trades = 0;
    gameStore.initialValue = initialPrice;
    gameStore.highestValue = initialPrice;
    gameStore.currentCard = null;
    gameStore.shuffle = Math.random() - 0.5;
    gameStore.gameOver = false;
  });

  if (gameStore.gameOver) {
    return (
      <div class={styles.container}>
        <GameOver
          level={gameStore.level}
          highestValue={gameStore.highestValue}
        />
        <button
          class={styles.button}
          onClick$={(_event, element) => {
            element.blur();
            handleReset();
          }}
        >
          Restart Rumble
        </button>
      </div>
    );
  }

  return (
    <div>
      <Trades
        level={gameStore.level}
        initialValue={gameStore.initialValue}
        trades={gameStore.trades}
      />

      {gameStore.currentCard && (
        <Card {...gameStore.currentCard} isRevealed={true} />
      )}

      <div class={styles.options}>
        {[optionA, optionB]
          .sort(() => gameStore.shuffle)
          .map((option, index) => (
            <div key={index}>
              <Resource
                value={option}
                onPending={() => <CardDummy />}
                onRejected={() => <CardDummy />}
                onResolved={(card) => {
                  return (
                    <button
                      onClick$={(_event, element) => {
                        element.blur();
                        handleTrade(card);
                      }}
                    >
                      <Card {...card} />
                    </button>
                  );
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
});
