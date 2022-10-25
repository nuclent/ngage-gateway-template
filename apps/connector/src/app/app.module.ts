import { Module } from '@nestjs/common'
import { cachingEnv } from '@nuclent/be-caching'
import { CommonModule, natsEnv } from '@nuclent/be-core'
import { appEnv } from './app.env'

@Module({
  imports: [
    CommonModule.register({
      load: [
        // provide additional env for connector service
        appEnv,
        // default env for inner microservice communication channel: NATS.io
        natsEnv,
        // additional env to have redis caching for service
        cachingEnv,
      ],
    }),
  ],
})
export class AppModule {}
