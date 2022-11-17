import { INestApplication } from '@nestjs/common'
import { ClientNats } from '@nestjs/microservices'
import { CommonModule, natsEnv, NatsConsumerModule, baseEnv, appConfig, NatsClientService } from '@nuclent/be-core'
import { buildTestModule, context } from '@nuclent/be-testing'
import { RpcActionEnum, RpcActionPayload } from '@nuclent/ngage-be-common'
import { BaseEkycRpcService } from '@nuclent/ngage-ekyc'
import {
  BaseRpcTransactionModule,
  cmdGetTransactionById,
  cmdListTransactions,
  cmdSearchTransactions,
  cmdUpdateTransaction,
  CMD_GET_TRANSACTION_BY_ID,
  CMD_LIST_TRANSACTIONS,
  CMD_SEARCH_TRANSACTIONS,
  CMD_UPDATE_TRANSACTION,
  registerRpcTransactionService,
  RpcActionTransactionPayload,
  RpcGetTransactionByIdDto,
  RpcGetTransactionByIdResponse,
  RpcListTransactionsDto,
  RpcListTransactionsResponse,
  RpcSearchTransactionsDto,
  RpcSearchTransactionsResponse,
  RpcUpdateTransactionDto,
  RpcUpdateTransactionResponse,
  RPC_TRANSACTION_NAME,
  TransactionType,
} from '@nuclent/ngage-statistics'
import { TransactionsService } from './transactions.service'

const expectRes = ({ context, ...rest }: RpcActionPayload<any>) => ({
  attributes: undefined,
  ...rest,
  context: expect.objectContaining(context),
})

const current: RpcActionTransactionPayload = {
  id: 'id',
  trxId: 'trx-id',
  spaceId: 'space-id',
  amount: 1000,
  currencyCode: 'VND',
  type: TransactionType.INTERNAL,
  valueDate: new Date(),
  rawValueDate: '12/12/1212',
}

describe('Ekyc - e2e', () => {
  let app: INestApplication
  let nats: ClientNats
  let service: BaseEkycRpcService

  beforeAll(async () => {
    const module = await buildTestModule(
      {
        imports: [
          CommonModule.register({ load: [natsEnv] }),
          NatsConsumerModule,
          BaseRpcTransactionModule.register({ providers: registerRpcTransactionService(TransactionsService) }),
        ],
      },
      {
        builder: b => b.overrideProvider(baseEnv.KEY).useValue({ ...baseEnv(), inDev: false, inTest: false }),
        mockNats: false,
      },
    )

    app = module.createNestApplication()
    await appConfig(app)
    await app.init()

    service = app.get(RPC_TRANSACTION_NAME)
    nats = app.get(NatsClientService).getClient()
  })

  afterAll(() => app.close())
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(nats).toBeDefined()
  })

  describe(CMD_LIST_TRANSACTIONS, () => {
    const payload: RpcListTransactionsDto = {
      context,
      current: [current],
      query: { categoryId: 'cat-id', limit: 20, offset: 0 },
    }
    const res: RpcListTransactionsResponse = { data: [] }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'ListTransactions', res)

      await expect(cmdListTransactions(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdListTransactions(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdListTransactions(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual(
        {},
      )
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_GET_TRANSACTION_BY_ID, () => {
    const payload: RpcGetTransactionByIdDto = {
      id: 'trx-id',
      context,
      current,
    }
    const res: RpcGetTransactionByIdResponse = { amount: 20000 }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'GetTransactionById', res)

      await expect(cmdGetTransactionById(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdGetTransactionById(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdGetTransactionById(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_UPDATE_TRANSACTION, () => {
    const payload: RpcUpdateTransactionDto = {
      id: 'trx-id',
      payload: { amount: 200 },
      context,
      current,
    }
    const res: RpcUpdateTransactionResponse = { amount: 200 }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'UpdateTransaction', res)

      await expect(cmdUpdateTransaction(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdUpdateTransaction(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdUpdateTransaction(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_SEARCH_TRANSACTIONS, () => {
    const payload: RpcSearchTransactionsDto = {
      context,
      current: [current],
      payload: { filters: { spaceIds: ['space-id'] }, limit: 20, offset: 0 },
    }
    const res: RpcSearchTransactionsResponse = { data: [] }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'SearchTransactions', res)

      await expect(cmdSearchTransactions(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSearchTransactions(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdSearchTransactions(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })
})
