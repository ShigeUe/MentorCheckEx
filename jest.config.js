/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  verbose: true,
  roots: ['<rootDir>/src/js'],
  testMatch: ['<rootDir>/src/js/tests/*.test.ts'],
  testEnvironment: 'jsdom',
};

module.exports = config;