/* eslint-disable */
import coverage from '../../coverage'

export default {
  displayName: 'connector',
  preset: '../../jest.preset.js',
  ...coverage.appCoverage(),
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/connector',
}
