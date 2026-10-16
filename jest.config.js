module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/tests/ui/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/tests/ui/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  // The first real RN render triggers lazy native-module transforms (71s measured on this
  // Windows checkout). Individual async UI queries still retain their short waitFor deadlines.
  testTimeout: 120000,
};
