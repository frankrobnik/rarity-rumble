import { component$, Slot } from '@builder.io/qwik';
import { Link, type RequestHandler } from '@builder.io/qwik-city';
import ImgLogo from '~/media/Logo-2.webp?jsx';
import '@fontsource/patua-one';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 600 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 600,
  });
};

export default component$(() => {
  return (
    <div class="container">
      <Link href="/" class="logo">
        <ImgLogo alt="Rarity Rumble: Top Value Showdown" />
      </Link>
      <Slot />
    </div>
  );
});
