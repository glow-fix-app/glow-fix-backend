import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/main.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/\$1',
    '^@glow-fix/types$': '<rootDir>/../packages/types/src',
    '^@glow-fix/utils$': '<rootDir>/../packages/utils/src',
  },
};

export default config;


// import type { Config } from 'jest';

// const config: Config = {
//   moduleFileExtensions: ['js', 'json', 'ts'],
//   rootDir: 'src',
//   testRegex: '.*\\.spec\\.ts$',
//   transform: {
//     '^.+\\.(t|j)s$': 'ts-jest',
//   },
//   collectCoverageFrom: ['**/*.(t|j)s'],
//   coverageDirectory: '../coverage',
//   coveragePathIgnorePatterns: [
//     '/node_modules/',
//     '/dist/',
//     'main.ts',
//     '.module.ts',
//     '.dto.ts',
//     'index.ts',
//   ],
//   coverageThreshold: {
//     global: {
//       branches: 70,
//       functions: 80,
//       lines: 80,
//       statements: 80,
//     },
//   },
//   testEnvironment: 'node',
//   moduleNameMapper: {
//     '^@modules/(.*)$': '<rootDir>/modules/\$1',
//     '^@common/(.*)$': '<rootDir>/common/\$1',
//     '^@config/(.*)$': '<rootDir>/config/\$1',
//     '^@database/(.*)$': '<rootDir>/database/\$1',
//     '^@glow-fix/types$': '<rootDir>/../../packages/types/src',
//   },
//   globals: {
//     'ts-jest': {
//       tsconfig: {
//         strict: false, // more lenient in tests
//       },
//     },
//   },
//   clearMocks: true,
//   restoreMocks: true,
//   verbose: true,
// };

// export default config;
