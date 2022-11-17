import { Module } from '@nestjs/common'
import { cachingEnv } from '@nuclent/be-caching'
import { CommonModule, NatsConsumerModule, natsEnv } from '@nuclent/be-core'
import {
  BaseEkycRpcModule,
  ClientEkycRpcModule,
  registerClientEkycRpcService,
  registerEkycRpcService,
} from '@nuclent/ngage-ekyc'
import { BaseRpcSpaceModule, registerRpcSpaceService } from '@nuclent/ngage-spaces'
import { BaseRpcTransactionModule, registerRpcTransactionService } from '@nuclent/ngage-statistics'
import { AuthRpcModule, registerAuthRpcService } from '@nuclent/ngage-users'
import { appEnv } from './app.env'
import { ClientEkycService } from './ekyc/ekyc-client.service'
import { EkycService } from './ekyc/ekyc.service'
import { SpacesService } from './spaces/spaces.service'
import { TransactionsService } from './transactions/transactions.service'
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
    // register ekyc rpc module
    BaseEkycRpcModule.register({ providers: registerEkycRpcService(EkycService) }),
    // register client ekyc rpc module
    ClientEkycRpcModule.register({ providers: registerClientEkycRpcService(ClientEkycService) }),
    // register transaction module
    BaseRpcTransactionModule.register({ providers: registerRpcTransactionService(TransactionsService) }),
  ],
})
export class AppModule {}
