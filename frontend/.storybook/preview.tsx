import Toaster from '@/components/atoms/toaster';
import { inter } from '@/fonts';
import { projectSettings } from '@/mocks/projectSettings';
import ShipAndLanguageProvider from '@/providers/ship-and-language';
import '@/styles/global/index.css';
import type { Preview } from '@storybook/react';
import 'flag-icons/css/flag-icons.min.css';
import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'tailwindcss/tailwind.css';
import nextIntl from './next-intl';
import theme from './theme';

const preview: Preview = {
  initialGlobals: {
    locale: 'en',
    locales: {
      en: 'English',
      de: 'German',
    },
  },
  parameters: {
    nextIntl,
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/en',
        query: {},
      },
      router: {
        basePath: '',
        pathname: '/en',
        route: '/[locale]',
        query: { locale: 'en' },
        asPath: '/en',
        push: async () => true,
        replace: async () => true,
        reload: () => {},
        back: () => {},
        forward: () => {},
        prefetch: async () => {},
        beforePopState: () => {},
        events: {
          on: () => {},
          off: () => {},
          emit: () => {},
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        isPreview: false,
      },
    },
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
        order: ['Introduction', 'Accessibility', 'Atoms', 'Molecules', 'Organisms', 'Pages', '*'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={inter.variable} data-theme="default">
        <ShipAndLanguageProvider projectSettings={projectSettings}>
          <Story />
          <Toaster />
        </ShipAndLanguageProvider>
        <div id="react-modal-custom-portal" />
      </div>
    ),
  ],
};

export default preview;
