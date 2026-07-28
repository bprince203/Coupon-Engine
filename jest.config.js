/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: false, // Skip type-checking in tests — handled by tsc --noEmit
    }],
  },
  moduleNameMapper: {
    '^expo-clipboard$': '<rootDir>/__mocks__/expo-clipboard.ts',
  },
};
