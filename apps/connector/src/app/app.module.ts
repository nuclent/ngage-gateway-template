import { Module } from '@nestjs/common'
import { cachingEnv } from '@nuclent/be-caching'
import { CommonModule, NatsConsumerModule, natsEnv } from '@nuclent/be-core'
import { AuthRpcModule, registerAuthRpcService } from '@nuclent/ngage-users'
import { appEnv } from './app.env'
import { AuthService } from './users/auth.service'

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
    // register communication module
    NatsConsumerModule,
    // register auth rpc module
    AuthRpcModule.register({ providers: registerAuthRpcService(AuthService) }),
  ],
})
export class AppModule {}
