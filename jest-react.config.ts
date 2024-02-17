import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    testMatch: [
        "<rootDir>/tests/react/**/*.spec.{tsx,ts}",
      ]
};

export default config;