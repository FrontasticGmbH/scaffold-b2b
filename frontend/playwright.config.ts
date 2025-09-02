import path from 'path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  globalSetup: path.resolve(__dirname, 'e2e/setup/global-setup.ts'),
  testDir: './e2e',
  fullyParallel: false,
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], // This provides real-time console output
    ['html'], // This generates the HTML report
    [
      './e2e/reporters/flaky-tolerance-reporter.ts',
      {
        failureTolerancePercentage: 10, // Allow up to 10% test failures
        onlyFlakyTests: false, // Apply tolerance to all tests
      },
    ],
  ],
  timeout: 60000,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobileChrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    //
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'yarn run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: true,
  // },
});
