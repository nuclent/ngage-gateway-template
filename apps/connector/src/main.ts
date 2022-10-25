import { Logger } from '@nestjs/common'
import { ConfigService, ConfigType } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { appConfig, baseEnv, BASE_ENV } from '@nuclent/be-core'
import { AppModule } from './app/app.module'

/**
 * NOTE: this is default bootstrap for all connector services
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await appConfig(app)

  const configService = app.get(ConfigService)
  const base = configService.get<ConfigType<typeof baseEnv>>(BASE_ENV)
  await app.listen(base.port, '0.0.0.0')
  Logger.log(`🚀Application is running on: ${await app.getUrl()}`)
}

bootstrap()
