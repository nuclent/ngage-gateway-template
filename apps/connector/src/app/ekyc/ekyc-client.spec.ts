import { INestApplication } from '@nestjs/common'
import { ClientNats } from '@nestjs/microservices'
import { CommonModule, natsEnv, NatsConsumerModule, baseEnv, appConfig, NatsClientService } from '@nuclent/be-core'
import { buildTestModule, context } from '@nuclent/be-testing'
import { RpcActionEnum, RpcActionPayload } from '@nuclent/ngage-be-common'
import {
  BaseClientEkycRpcService,
  ClientEkycRpcModule,
  CLIENT_EKYC_RPC_NAME,
  cmdEkycGetPolling,
  cmdEkycRequestId,
  cmdEkycUploadPhoto,
  cmdEkycVerifyOcr,
  CMD_EKYC_POLLING,
  CMD_EKYC_REQUEST_ID,
  CMD_EKYC_UPLOAD_PHOTO,
  CMD_EKYC_VERIFY_OCR,
  EkycDocType,
  EkycStatusOfStep,
  registerClientEkycRpcService,
  RpcPollingDto,
  RpcPollingResponse,
  RpcRequestIdDto,
  RpcRequestIdResponse,
  RpcUploadPhotoDto,
  RpcUploadPhotoResponse,
  RpcVerifyOcrDto,
  RpcVerifyOcrResponse,
  StepEkycEnum,
} from '@nuclent/ngage-ekyc'
import { ClientEkycService } from './ekyc-client.service'

const expectRes = ({ context, ...rest }: RpcActionPayload<any>) => ({
  attributes: undefined,
  ...rest,
  context: expect.objectContaining(context),
})

describe('Client Ekyc - e2e', () => {
  let app: INestApplication
  let nats: ClientNats
  let service: BaseClientEkycRpcService

  beforeAll(async () => {
    const module = await buildTestModule(
      {
        imports: [
          CommonModule.register({ load: [natsEnv] }),
          NatsConsumerModule,
          ClientEkycRpcModule.register({ providers: registerClientEkycRpcService(ClientEkycService) }),
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

    service = app.get(CLIENT_EKYC_RPC_NAME)
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

  describe(CMD_EKYC_REQUEST_ID, () => {
    const payload: RpcRequestIdDto = { context, typeDoc: EkycDocType.ID }
    const res: RpcRequestIdResponse = { requestId: 'req-id' }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'RequestId', res)

      await expect(cmdEkycRequestId(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycRequestId(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycRequestId(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_EKYC_POLLING, () => {
    const payload: RpcPollingDto = { context, requestId: 'req-id' }
    const res: RpcPollingResponse = {
      typeDoc: EkycDocType.ID,
      step: StepEkycEnum.SELFIE,
      status: EkycStatusOfStep.ON_GOING,
      imageDocs: { frontPath: 'front', backPath: 'back', selfiePath: 'selfie' },
    }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'Polling', res)

      await expect(cmdEkycGetPolling(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycGetPolling(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycGetPolling(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual(
        {},
      )
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_EKYC_UPLOAD_PHOTO, () => {
    const payload: RpcUploadPhotoDto = { context, requestId: 'req-id', step: StepEkycEnum.SELFIE, fileRef: 'ref' }
    const res: RpcUploadPhotoResponse = {
      typeDoc: EkycDocType.ID,
      step: StepEkycEnum.SELFIE,
      status: EkycStatusOfStep.ON_GOING,
      imageDocs: { frontPath: 'front', backPath: 'back', selfiePath: 'selfie' },
    }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'UploadPhoto', res)

      await expect(cmdEkycUploadPhoto(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycUploadPhoto(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycUploadPhoto(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual(
        {},
      )
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_EKYC_VERIFY_OCR, () => {
    const payload: RpcVerifyOcrDto = {
      context,
      payload: {
        fullName: 'name',
        address: 'aaaa',
      },
      requestId: 'req-id',
    }
    const res: RpcVerifyOcrResponse = {
      typeDoc: EkycDocType.ID,
      step: StepEkycEnum.SELFIE,
      status: EkycStatusOfStep.ON_GOING,
      imageDocs: { frontPath: 'front', backPath: 'back', selfiePath: 'selfie' },
    }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'VerifyOcr', res)

      await expect(cmdEkycVerifyOcr(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycVerifyOcr(nats, RpcActionEnum.process, payload)).rejects.toMatchObject({
        response: { data: { additional: 'Method not implemented.' } },
      })
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdEkycVerifyOcr(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })
})
