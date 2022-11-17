import { INestApplication, InternalServerErrorException } from '@nestjs/common'
import { ClientNats } from '@nestjs/microservices'
import { CommonModule, natsEnv, NatsConsumerModule, baseEnv, appConfig, NatsClientService } from '@nuclent/be-core'
import { buildTestModule, context } from '@nuclent/be-testing'
import { RpcActionEnum, RpcActionPayload } from '@nuclent/ngage-be-common'
import {
  BaseRpcSpaceModule,
  BaseRpcSpaceService,
  cmdSpacesCreateSpace,
  cmdSpacesDeleteSpace,
  cmdSpacesGetBalance,
  cmdSpacesGetSpaceById,
  cmdSpacesGetSpaces,
  cmdSpacesUpdateSpace,
  CMD_SPACES_CREATE_SPACE,
  CMD_SPACES_DELETE_SPACE,
  CMD_SPACES_GET_BALANCE,
  CMD_SPACES_GET_SPACES,
  CMD_SPACES_GET_SPACE_BY_ID,
  CMD_SPACES_UPDATE_SPACE,
  registerRpcSpaceService,
  RpcActionSpacePayload,
  RpcCreateSpaceDto,
  RpcCreateSpaceResponse,
  RpcDeleteSpaceDto,
  RpcDeleteSpaceResponse,
  RpcGetBalanceDto,
  RpcGetBalanceResponse,
  RpcGetSpaceByIdDto,
  RpcGetSpaceByIdResponse,
  RpcGetSpacesDto,
  RpcGetSpacesResponse,
  RpcUpdateSpaceDto,
  RpcUpdateSpaceResponse,
  RPC_SPACE_NAME,
  SpaceType,
} from '@nuclent/ngage-spaces'
import { SpacesService } from './spaces.service'

const expectRes = ({ context, ...rest }: RpcActionPayload<any>) => ({
  attributes: undefined,
  ...rest,
  context: expect.objectContaining(context),
})

const current: RpcActionSpacePayload = {
  id: 'space-id',
  ownerId: 'owner-id',
  externalId: 'ext-id',
  name: 'space name',
  currencyCode: 'VND',
  isPrimary: false,
  type: SpaceType.PRIMARY,
}

describe('Spaces - e2e', () => {
  let app: INestApplication
  let nats: ClientNats
  let service: BaseRpcSpaceService

  beforeAll(async () => {
    const module = await buildTestModule(
      {
        imports: [
          CommonModule.register({ load: [natsEnv] }),
          NatsConsumerModule,
          BaseRpcSpaceModule.register({ providers: registerRpcSpaceService(SpacesService) }),
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

    service = app.get(RPC_SPACE_NAME)
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

  describe(CMD_SPACES_GET_SPACES, () => {
    const payload: RpcGetSpacesDto = { context, current: [current] }
    const res: RpcGetSpacesResponse = { data: [{ balances: { totalBalance: 0, availableBalance: 0 } }] }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'GetSpaces', res)

      await expect(cmdSpacesGetSpaces(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesGetSpaces(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesGetSpaces(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual(
        {},
      )
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_SPACES_CREATE_SPACE, () => {
    const payload: RpcCreateSpaceDto = { context, payload: { name: 'space name' } }
    const res: RpcCreateSpaceResponse = {
      balances: { totalBalance: 0, availableBalance: 0 },
      id: 'new-id',
      externalId: 'ext-id',
      currencyCode: 'VND',
    }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'CreateSpace', res)

      await expect(cmdSpacesCreateSpace(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesCreateSpace(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdSpacesCreateSpace(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_SPACES_GET_SPACE_BY_ID, () => {
    const payload: RpcGetSpaceByIdDto = { context, current, id: current.id }
    const res: RpcGetSpaceByIdResponse = { balances: { availableBalance: 0, totalBalance: 0 } }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'GetSpaceById', res)

      await expect(cmdSpacesGetSpaceById(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesGetSpaceById(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdSpacesGetSpaceById(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_SPACES_UPDATE_SPACE, () => {
    const payload: RpcUpdateSpaceDto = { context, id: current.id, current, payload: { name: 'new name' } }
    const res: RpcUpdateSpaceResponse = { balances: { totalBalance: 0, availableBalance: 0 } }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'UpdateSpace', res)

      await expect(cmdSpacesUpdateSpace(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesUpdateSpace(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdSpacesUpdateSpace(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_SPACES_DELETE_SPACE, () => {
    const payload: RpcDeleteSpaceDto = { context, current, id: current.id }
    const res: RpcDeleteSpaceResponse = { balances: { availableBalance: 0, totalBalance: 0 } }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'DeleteSpace', res)

      await expect(cmdSpacesDeleteSpace(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesDeleteSpace(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(
        cmdSpacesDeleteSpace(nats, RpcActionEnum.post, { ...payload, response: res }),
      ).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_SPACES_GET_BALANCE, () => {
    const payload: RpcGetBalanceDto = { context, current: [current] }
    const res: RpcGetBalanceResponse = { data: { VND: { balance: 0, sharedBalance: 0 } } }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'GetBalance', res)

      await expect(cmdSpacesGetBalance(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesGetBalance(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdSpacesGetBalance(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual(
        {},
      )
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })
})
