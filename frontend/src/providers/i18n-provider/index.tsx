'use client';

import React from 'react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

const I18nProvider = ({
  children,
  locale,
  messages,
}: React.PropsWithChildren<{ locale: string; messages: AbstractIntlMessages }>) => {
  return (
    <NextIntlClientProvider messages={messages} locale={locale} onError={() => {}}>
      {children}
    </NextIntlClientProvider>
  );
};

export default I18nProvider;
