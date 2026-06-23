/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 5,
            functions: 10,
            lines: 25,
            statements: 25,
        },
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "src/index.ts",
        "src/db.ts"
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
