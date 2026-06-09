import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/unit/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        strict: false,
        esModuleInterop: true,
        resolveJsonModule: true,
        isolatedModules: true,
        module: 'CommonJS',
        target: 'ES2015',
        lib: ['ES2015', 'DOM'],
        skipLibCheck: true
      }
    }]
  }
};

export default config;
