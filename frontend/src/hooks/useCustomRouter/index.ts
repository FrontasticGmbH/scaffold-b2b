'use client';

import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { constructLocalizedUrl } from '@/utils/links';
import { Locale } from '@/project.config';

const useCustomRouter = () => {
  const { push: pushRoute, replace: replaceRoute, ...router } = useRouter();

  const { locale } = useParams();

  const push = useCallback(
    (
      href: string,
      { locale: localeOverride, ...options }: Parameters<typeof pushRoute>[1] & { locale?: string } = {},
    ) => {
      pushRoute(constructLocalizedUrl(href, (localeOverride ?? locale) as Locale), options);
    },
    [pushRoute, locale],
  );

  const replace = useCallback(
    (
      href: string,
      { locale: localeOverride, ...options }: Parameters<typeof replaceRoute>[1] & { locale?: string } = {},
    ) => {
      replaceRoute(constructLocalizedUrl(href, (localeOverride ?? locale) as Locale), options);
    },
    [replaceRoute, locale],
  );

  return { ...router, push, replace };
};

export default useCustomRouter;
