import {
  Resource,
  component$,
  useResource$,
  useStore,
  $,
  type ResourceReturn,
} from '@builder.io/qwik';
import {
  Card,
  type CardProps,
  getCardData,
  CardDummy,
} from '~/components/card/card';
import { Trades } from '~/components/trades/trades';
import styles from './index.module.css';

type GameStore = {
  level: number;
  trades: number;
  startValue: number;
  shuffle: boolean;
  currentCard?: CardProps;
  tradeOptions: (CardProps | null)[];
};

export default component$(() => {
  const gameStore = useStore<GameStore>({
    level: 0,
    startValue: Math.random() * 0.5 + 4.5,
    trades: 0,
    tradeOptions: [null, null],
    shuffle: Math.random() < 0.5,
  });

  const startingCard = useResource$<CardProps>(async () => {
    return getCardData(gameStore.startValue);
  });
  startingCard.value.then((value) => {
    gameStore.currentCard = value;
  });
  const tradeOptionA = useResource$<CardProps>(async () => {
    return getCardData(gameStore.startValue * (gameStore.shuffle ? 1.5 : 0.5));
  });
  const tradeOptionB = useResource$<CardProps>(async () => {
    return getCardData(gameStore.startValue * (gameStore.shuffle ? 0.5 : 1.5));
  });

  startingCard.value.then((value) => {
    gameStore.currentCard = value;
  });
  tradeOptionA.value.then((value) => {
    gameStore.tradeOptions[gameStore.shuffle ? 0 : 1] = value;
  });
  tradeOptionB.value.then((value) => {
    gameStore.tradeOptions[gameStore.shuffle ? 1 : 0] = value;
  });

  const onTrade = $((selectedCard: ResourceReturn<CardProps>) => {
    console.log(selectedCard);
    // const tradeId = gameStore.tradeOptions.findIndex(
    //   (option) => option === selectedCard
    // );
    // gameStore.trades++;
    // gameStore.tradeOptions[tradeId] = gameStore.currentCard;
    // gameStore.currentCard = selectedCard;
  });

  return (
    <div>
      <Trades
        level={gameStore.level}
        startValue={gameStore.startValue}
        trades={gameStore.trades}
      />

      {gameStore.currentCard && (
        <Card {...gameStore.currentCard} isRevealed={true} />
      )}
      {/* <Resource
        value={gameStore.currentCard}
        onPending={() => <CardDummy />}
        onResolved={(card) => {
          return <Card {...card} isRevealed={true} />;
        }}
      /> */}

      {/* <div class={styles.options}>
        {gameStore.tradeOptions.map((option, index) => (
          <Resource
            key={index}
            value={option}
            onPending={() => <CardDummy />}
            onResolved={(card) => {
              return (
                <button
                  onClick$={(_event, element) => {
                    element.blur();
                    onTrade(option);
                  }}
                >
                  <Card {...card} />
                </button>
              );
            }}
          />
        ))}
      </div> */}
    </div>
  );
});
