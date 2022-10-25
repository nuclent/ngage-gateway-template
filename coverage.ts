import { readCachedProjectGraph } from '@nrwl/devkit'
import nxPreset from '@nrwl/jest/preset'
import type { InitialOptionsTsJest } from 'ts-jest'

const root = process.env['NX_WORKSPACE_ROOT']
const graph = readCachedProjectGraph()
const projectDir = `${root}/${graph.nodes[process.env['NX_TASK_TARGET_PROJECT'] as string].data.root}`

const BaseConfig: InitialOptionsTsJest = {
  resolver: nxPreset.resolver,
  testMatch: [...nxPreset.testMatch, '**/*.e2e-spec.ts'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  detectOpenHandles: true,
  detectLeaks: false,
  collectCoverageFrom: ['**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'main.ts', 'index.ts', 'types/', 'env.ts'],
  coverageReporters: ['html'],
  setupFiles: [`${root}/jest.setup.ts`],
}

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

const GlobFiles: Record<string, any> = {
  module: {
    pattern: '**/*.modules.ts',
    threshold: {
      branches: 100,
      functions: 100,
    },
  },
  controller: {
    pattern: '**/*.controller.ts',
    threshold: {
      branches: 100,
      functions: 100,
    },
  },
  service: {
    pattern: '**/*.service.ts',
    threshold: {
      branches: 80,
      functions: 100,
    },
  },
}

function globFiles() {
  const glob = require('glob')
  const coveragePatterns = Object.keys(GlobFiles).filter(
    i => glob.sync(GlobFiles[i].pattern, { cwd: `${root}/${projectDir}` }).length > 0,
  )
  return coveragePatterns
}

type BuilderFn = (args: DeepPartial<InitialOptionsTsJest>) => DeepPartial<InitialOptionsTsJest>
function coverage(fn: BuilderFn = base => base): InitialOptionsTsJest {
  const base: InitialOptionsTsJest = {
    ...BaseConfig,
    coverageThreshold: {
      global: {
        lines: 80,
        statements: 80,
      },
      '**/*.ts': {
        branches: 60,
        functions: 70,
      },
    },
  }
  return { ...base, ...fn(base) } as InitialOptionsTsJest
}

function appCoverage(fn: BuilderFn = base => base): InitialOptionsTsJest {
  const glob = globFiles()
  const base = coverage(base => ({
    coverageThreshold: {
      ...base.coverageThreshold,
      ...glob.reduce((acc, i) => ({ ...acc, [GlobFiles[i].pattern]: GlobFiles[i].threshold }), {}),
    },
  }))
  return { ...base, ...fn(base) } as InitialOptionsTsJest
}

export default {
  coverage,
  appCoverage,
}
