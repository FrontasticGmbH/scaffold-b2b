/** @type {import('jest').Config} */
const config = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json', diagnostics: { ignoreCodes: [2307, 7016] } }],
    '^.+\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleTransform.js',
  },
  coveragePathIgnorePatterns: ['<rootDir>/src/sdk/', '<rootDir>/src/lib/hooks/', '<rootDir>/src/project.config.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
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
