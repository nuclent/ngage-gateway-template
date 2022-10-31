import { Module } from '@nestjs/common'
import { cachingEnv } from '@nuclent/be-caching'
import { CommonModule, NatsConsumerModule, natsEnv } from '@nuclent/be-core'
import { BaseRpcSpaceModule, registerRpcSpaceService } from '@nuclent/ngage-spaces'
import { AuthRpcModule, registerAuthRpcService } from '@nuclent/ngage-users'
import { appEnv } from './app.env'
import { SpacesService } from './spaces/spaces.service'
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
    // register spaces rpc module
    BaseRpcSpaceModule.register({ providers: registerRpcSpaceService(SpacesService) }),
  ],
})
export class AppModule {}
