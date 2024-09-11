/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: ["TS151001"],
        },
      },
    ],
  },
  preset: "ts-jest",
  moduleNameMapper: {
    // "@/*": ["./src/*"],
    "^@/(.*)$": "<rootDir>/src/$1",
    // '^@App/(.*)$': '<rootDir>/src/$1',
    // '^lib/(.*)$': '<rootDir>/common/$1'
  },
};
