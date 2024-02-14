import type { Config } from 'jest';

const config: Config = {
    testMatch: [
        "<rootDir>/tests/js/**/*.spec.{tsx,ts}",
      ]
};

export default config;