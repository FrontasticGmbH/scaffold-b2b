import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['./docs/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-next-intl',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: process.env.NODE_ENV === 'development' ? ['../public/'] : [],
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  },
  webpackFinal(config) {
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/navigation': path.resolve('./__mocks__/next/navigation'),
    };

    return config;
  },
};

export default config;
