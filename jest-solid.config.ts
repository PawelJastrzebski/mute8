import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    preset: 'solid-jest/preset/browser',
    testMatch: [
        "<rootDir>/tests/solid/**/*.spec.{tsx,ts}",
      ]
};

export default config;