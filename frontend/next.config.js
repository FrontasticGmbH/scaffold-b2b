const withPlugins = require('next-compose-plugins');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**@type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    loader: 'custom',
    domains: ['res.cloudinary.com', 's3-eu-west-1.amazonaws.com'],
    deviceSizes: [
      640, 750, 828, 1080, 1200, 1280, 1440, 1520, 1640, 1720, 1800, 1920, 2048, 2280, 2460, 2640, 2820, 3000,
    ],
  },

  productionBrowserSourceMaps: true,

  env: {
    NEXT_PUBLIC_EXT_BUILD_ID:
      process.env.NEXT_PUBLIC_EXT_BUILD_ID ??
      JSON.stringify(process.env.NETLIFY ? process.env.COMMIT_REF.substring(0, 7) : 'staging'),
  },

  webpack(config) {
    if (!config.externals) config.externals = [];

    config.externals.push('canvas');

    return config;
  },

  async redirects() {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      { source: '/__preview/:path*', destination: '/preview/:path*' },
      { source: '/:locale/__preview/:path*', destination: '/:locale/preview/:path*' },
    ];
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
});

module.exports = withPlugins([withBundleAnalyzer], nextConfig);
