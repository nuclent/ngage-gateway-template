import { INestApplication } from '@nestjs/common'
import { ClientNats } from '@nestjs/microservices'
import { CommonModule, natsEnv, NatsConsumerModule, baseEnv, appConfig, NatsClientService } from '@nuclent/be-core'
import { buildTestModule, context } from '@nuclent/be-testing'
import { RpcActionEnum, RpcActionPayload } from '@nuclent/ngage-be-common'
import {
  BaseEkycFields,
  BaseEkycRpcModule,
  BaseEkycRpcService,
  cmdEkycGetEkyc,
  CMD_EKYC_GET,
  EkycStatus,
  EKYC_RPC_NAME,
  registerEkycRpcService,
  RpcGetEkycDto,
  RpcGetEkycResponse,
} from '@nuclent/ngage-ekyc'
import { EkycService } from './ekyc.service'

const expectRes = ({ context, ...rest }: RpcActionPayload<any>) => ({
  attributes: undefined,
  ...rest,
  context: expect.objectContaining(context),
})

const current: BaseEkycFields = {
  fullName: 'Hn',
  dob: '12/11/1111',
  idNumber: '121111111',
  issueDate: '12/11/1111',
  placeOfIssue: 'Hn',
  status: EkycStatus.NOT_YET,
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
          BaseEkycRpcModule.register({ providers: registerEkycRpcService(EkycService) }),
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

    service = app.get(EKYC_RPC_NAME)
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

  describe(CMD_EKYC_GET, () => {
    const payload: RpcGetEkycDto = { context, current }
    const res: RpcGetEkycResponse = { gender: 'a', issueDate: '21/22/2222' }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'GetEkycData', res)

      await expect(cmdEkycGetEkyc(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycGetEkyc(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycGetEkyc(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })
})
