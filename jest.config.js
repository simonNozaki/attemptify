module.exports = {
    roots: [
      '<rootDir>/test'
    ],
    testMatch: [
      '**/?(*-)+(spec|tests).[jt]s?(x)'
    ],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testEnvironment: 'node'
}
