import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import defaultMessages from '../../src/messages/en.json';

// Custom render function that wraps components in NextIntlClientProvider
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(
    <NextIntlClientProvider locale="en-us" messages={defaultMessages}>
      {ui}
    </NextIntlClientProvider>,
    options,
  );

export function createWrapper(locale = 'en-us', messages = defaultMessages) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  };
}

// Re-export everything from React Testing Library
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// Override render method
// eslint-disable-next-line import/export
export { customRender as render };
