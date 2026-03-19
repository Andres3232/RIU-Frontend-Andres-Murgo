module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@models/(.*)$': '<rootDir>/src/app/super-hero/models/$1',
    '^@services/(.*)$': '<rootDir>/src/app/super-hero/services/$1',
  },
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/main.ts',
  ],
};
