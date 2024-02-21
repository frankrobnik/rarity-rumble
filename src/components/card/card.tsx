import { component$ } from '@builder.io/qwik';
import styles from './card.module.css';

type RawCardData = {
  id: string;
  name: string;
  prices: {
    usd: string | null;
    usd_foil: string | null;
    usd_etched: string | null;
  };
  layout: string; // "normal" | "transform" | ...
  image_uris: {
    normal: string;
  };
};

export type CardProps = {
  id: string;
  name: string;
  price: number;
  isRevealed?: true;
  imageUrl: string;
};

export const Card = component$((props: CardProps) => {
  const { name, price, isRevealed, imageUrl } = props;

  return (
    <figure class={styles.card}>
      {isRevealed && <figcaption>{price.toFixed(2)} $</figcaption>}
      <img src={imageUrl} alt={name} width="244" height="340" />
    </figure>
  );
});

export async function getRandomCardData(maxValue: number) {
  const url = new URL('https://api.scryfall.com/cards/search');
  url.searchParams.append('include_extras', 'true');
  url.searchParams.append('order', 'usd');
  url.searchParams.append('dir', 'desc');
  url.searchParams.append('q', 'usd<' + maxValue);
  const res = await fetch(url);

  const listOfCards: { data: RawCardData[] } = await res.json();
  const firstNormalCard = listOfCards.data.find(
    (card) => card.layout === 'normal'
  );

  const priceInUsd =
    (firstNormalCard?.prices.usd ||
      firstNormalCard?.prices.usd_foil ||
      firstNormalCard?.prices.usd_etched) ??
    '0.1';

  return {
    id: firstNormalCard?.id ?? 'noooooID',
    name: firstNormalCard?.name ?? 'noooo',
    price: Number(priceInUsd),
    imageUrl: firstNormalCard?.image_uris.normal ?? '',
  };
}

export const CardDummy = () => (
  <div class={styles.dummy}>
    <div></div>
  </div>
);
