import React from 'react';
import type { Preview } from '@storybook/react';
import { inter } from '@/fonts';
import Toaster from '@/components/atoms/toaster';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/global/index.css';
import theme from './theme';
import ShipAndLanguageProvider from '@/providers/ship-and-language';
import I18nProvider from '@/providers/I18n';
import translations from './translations';

const preview: Preview = {
  parameters: {
    docs: {
      theme: theme,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={inter.variable}>
        <I18nProvider translations={translations}>
          <ShipAndLanguageProvider>
            <Story />
            <Toaster />
          </ShipAndLanguageProvider>
        </I18nProvider>
      </div>
    ),
  ],
};

export default preview;
