const merge = require('merge');
const ts_preset = require('ts-jest/jest-preset');

if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'test') {
    process.env.NODE_ENV = 'test';
    process.env.KNEX_DRIVER = 'sqlite3';
    process.env.KNEX_DATABASE = ':memory:';
}

module.exports = merge.recursive(ts_preset, {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/migrations/**',
        '!src/test/**',
    ],
    clearMocks: true,
    verbose: true,
    testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
    ],
    globals: {
        'ts-jest': {
            packageJson: 'package.json',
        },
    }
});
