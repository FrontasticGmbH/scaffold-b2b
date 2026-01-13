/** @type {import('jest').Config} */
const config = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json', diagnostics: { ignoreCodes: [2307, 7016] } }],
    '^.+\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleTransform.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(next-intl)/)',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/sdk/', '<rootDir>/src/lib/hooks/', '<rootDir>/src/project.config.ts'],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@heroicons/react/24/solid$': '<rootDir>/__mocks__/@heroicons/react/24/solid.tsx',
    '^@heroicons/react/24/outline$': '<rootDir>/__mocks__/@heroicons/react/24/outline.tsx',
    '^next-intl$': '<rootDir>/__mocks__/next-intl.tsx',
    '^next-intl/navigation$': '<rootDir>/__mocks__/next-intl.tsx',
    '^next-intl/routing$': '<rootDir>/__mocks__/next-intl.tsx',
    '^use-intl$': '<rootDir>/__mocks__/next-intl.tsx',
    '^@$': '<rootDir>/src',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/utils$': '<rootDir>/__test__/utils',
    '^@test/utils/(.*)$': '<rootDir>/__test__/utils/$1',
    '^@shared/types$': '<rootDir>/../types',
    '^@shared/types/(.*)$': '<rootDir>/../types/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup/setupTests.ts'],
};

module.exports = config;
