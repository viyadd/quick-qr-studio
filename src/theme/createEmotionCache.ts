// src/theme/createEmotionCache.ts

import createCache, { Options } from "@emotion/cache";

const isBrowser = typeof document !== "undefined";

// Функция для создания кэша стилей Emotion.
// Это нужно для правильной работы SSR в Next.js App Router.
export default function createEmotionCache(options?: Options) {
  let insertionPoint;
  const finalOptions = { key: "mui-css", ...options };

  if (isBrowser) {
    // Вставляет мета-тег для стилей, чтобы избежать мерцания
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ ...finalOptions, insertionPoint });
}
