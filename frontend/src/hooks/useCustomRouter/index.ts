'use client';

import { useCallback } from 'react';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context';
import { useRouter, useParams } from 'next/navigation';
import { constructLocalizedUrl } from '@/utils/links';

const useCustomRouter = () => {
  const { push: pushRoute, replace: replaceRoute, ...router } = useRouter();

  const { locale } = useParams();

  const push = useCallback(
    (href: string, { locale: localeOverride, ...options }: NavigateOptions & { locale?: string } = {}) => {
      pushRoute(constructLocalizedUrl(href, localeOverride ?? locale), options);
    },
    [pushRoute, locale],
  );

  const replace = useCallback(
    (href: string, { locale: localeOverride, ...options }: NavigateOptions & { locale?: string } = {}) => {
      replaceRoute(constructLocalizedUrl(href, localeOverride ?? locale), options);
    },
    [replaceRoute, locale],
  );

  return { ...router, push, replace };
};

export default useCustomRouter;
