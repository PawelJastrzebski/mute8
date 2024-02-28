import type { Config } from 'jest';

const config: Config = {
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: [
    "<rootDir>/tests/js/**/*.spec.{tsx,ts}",
  ]
};

export default config;