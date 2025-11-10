// src/theme/EmotionCache.tsx

"use client";

import * as React from "react";
import createEmotionCache from "./createEmotionCache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";
import type {
  EmotionCache,
  Options as EmotionCacheOptions,
} from "@emotion/cache";

export type NextAppDirEmotionCacheProviderProps = {
  options: EmotionCacheOptions;
  CacheProvider?: (props: {
    value: EmotionCache;
    children: React.ReactNode;
  }) => React.JSX.Element | null;
  children: React.ReactNode;
};

// MUI рекомендует использовать этот вспомогательный компонент для SSR в App Router
export default function NextAppDirEmotionCacheProvider(
  props: NextAppDirEmotionCacheProviderProps
) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [emotionCache] = React.useState(() => {
    const cache = createEmotionCache();
    cache.key = options.key;
    cache.compat = true; // Важно для совместимости с MUI styled()
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(emotionCache.inserted).join(" ");
    const serialized = `${emotionCache.key}{${names}}`;

    // Вставка мета-тега
    return (
      <style
        data-emotion={`${emotionCache.key} ${names}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for SSR styles
        dangerouslySetInnerHTML={{
          __html: serialized,
        }}
      />
    );
  });

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
