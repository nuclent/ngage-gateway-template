import { registerAs } from '@nestjs/config'
import { BaseEnvType } from '@nuclent/be-core'

/**
 * NOTE: template file for providing env
 * conventional env file to define and get ENV from nodejs process when running service
 */

type EnvType = BaseEnvType & {
  additionalEnv: string
}

export const APP_ENV = 'app'
export const appEnv = registerAs(
  APP_ENV,
  (): EnvType => ({
    requiredVars: ['REQUIRED_ENV'],
    additionalEnv: process.env.REQUIRED_ENV,
  }),
)
