import { component$ } from '@builder.io/qwik';
import { Link, type DocumentHead } from '@builder.io/qwik-city';
import ImgBackground from '~/media/Background-2.webp?jsx';
import styles from './index.module.css';

export default component$(() => {
  return (
    <div class={styles.container}>
      <ImgBackground class={styles.background} alt="game cover art" />
      <Link href="/rumble" class={styles.button}>
        Start Rumble
      </Link>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Rarity Rumble: Top Value Showdown',
  meta: [
    {
      name: 'description',
      content: 'Example app written to learn Qwik (JS).',
    },
  ],
};
