import React from 'react';
import type { Preview } from '@storybook/react';
import { inter } from '@/fonts';
import Toaster from '@/components/atoms/toaster';
import 'tailwindcss/tailwind.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'flag-icons/css/flag-icons.min.css';
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
    options: {
      storySort: {
        order: ['Introduction', 'Atoms', 'Molecules', 'Organisms', 'Pages', '*'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={inter.variable} data-theme="default">
        <I18nProvider translations={translations}>
          <ShipAndLanguageProvider>
            <Story />
            <Toaster />
          </ShipAndLanguageProvider>
        </I18nProvider>

        <div id="react-modal-custom-portal" />
      </div>
    ),
  ],
};

export default preview;
