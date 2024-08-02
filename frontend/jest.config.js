/**@type  {import('jest').Config}*/
const config = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/shared/types/(.*)$': '<rootDir>/../types/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup/setupTests.ts'],
};

module.exports = config;

