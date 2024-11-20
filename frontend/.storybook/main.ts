import type { StorybookConfig } from '@storybook/nextjs';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['./docs/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
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
      'next/navigation': require.resolve('../__mocks__/next/navigation'),
    };

    return config;
  },
};

export default config;
