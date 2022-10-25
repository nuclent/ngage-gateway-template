import { INestApplication, InternalServerErrorException } from '@nestjs/common'
import { CommonModule, natsEnv, NatsConsumerModule, baseEnv, appConfig, NatsClientService } from '@nuclent/be-core'
import {
  ActionRequiredException,
  ActionRequiredScreenEnum,
  RpcActionEnum,
  RpcActionPayload,
} from '@nuclent/ngage-be-common'
import { buildTestModule, context } from '@nuclent/be-testing'
import {
  BaseAuthRpcService,
  AuthRpcModule,
  registerAuthRpcService,
  AUTH_RPC_NAME,
  CMD_AUTH_VALIDATE_USERNAME,
  RpcValidateUsernameDto,
  RpcValidateUsernameResponse,
  cmdValidateUsername,
  CMD_AUTH_REGISTER,
  RpcRegisterDto,
  RpcRegisterResponse,
  cmdRegister,
  CMD_AUTH_JWKS,
  RpcJwksDto,
  RpcJwksResponse,
  cmdGetJwks,
  CMD_AUTH_LOGIN,
  RpcLoginDto,
  RpcLoginResponse,
  cmdUserLogin,
  CMD_AUTH_LOGOUT,
  RpcLogoutDto,
  RpcLogoutResponse,
  cmdUserLogout,
  CMD_AUTH_CHANGE_PASSWORD,
  RpcChangePasswordDto,
  RpcChangePasswordResponse,
  cmdChangePassword,
  CMD_AUTH_FORGOT_PASSWORD,
  RpcForgotPasswordDto,
  RpcForgotPasswordResponse,
  cmdForgotPassword,
} from '@nuclent/ngage-users'
import { throwError } from 'rxjs'
import { AuthService } from './auth.service'
import { ClientNats } from '@nestjs/microservices'

const expectRes = ({ context, ...rest }: RpcActionPayload<any>) => ({
  attributes: undefined,
  ...rest,
  context: expect.objectContaining(context),
})

describe('Auth - e2e', () => {
  let app: INestApplication
  let nats: ClientNats
  let service: BaseAuthRpcService

  beforeAll(async () => {
    const module = await buildTestModule(
      {
        imports: [
          CommonModule.register({ load: [natsEnv] }),
          NatsConsumerModule,
          AuthRpcModule.register({ providers: registerAuthRpcService(AuthService) }),
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

    service = app.get(AUTH_RPC_NAME)
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

  describe(CMD_AUTH_VALIDATE_USERNAME, () => {
    const payload: RpcValidateUsernameDto = {
      context,
      username: '+84987654321',
    }
    const res: RpcValidateUsernameResponse = { existed: false }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'ValidateUsername', res)

      await expect(cmdValidateUsername(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdValidateUsername(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdValidateUsername(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual(
        {},
      )
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_AUTH_REGISTER, () => {
    const payload: RpcRegisterDto = {
      context,
      phoneNumber: '+84987654321',
      username: 'username',
      password: 'password',
    }
    const res: RpcRegisterResponse = { id: 'userId' }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'Register', res)

      await expect(cmdRegister(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdRegister(nats, RpcActionEnum.process, payload)).rejects.toThrow(InternalServerErrorException)
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdRegister(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_AUTH_JWKS, () => {
    const payload: RpcJwksDto = { context }
    const res: RpcJwksResponse = { keys: [] }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'Jwks', res)

      await expect(cmdGetJwks(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdGetJwks(nats, RpcActionEnum.process, payload)).rejects.toThrow(InternalServerErrorException)
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdGetJwks(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_AUTH_LOGIN, () => {
    const payload: RpcLoginDto = { username: 'username', password: 'password', context }
    const res: RpcLoginResponse = { accessToken: 'access', refreshToken: 'refresh', id: 'uid' }

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'Login', res)

      await expect(cmdUserLogin(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdUserLogin(nats, RpcActionEnum.process, payload)).rejects.toThrow(InternalServerErrorException)
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdUserLogin(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_AUTH_LOGOUT, () => {
    const payload: RpcLogoutDto = { context }
    const res: RpcLogoutResponse = {}

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'Logout', res)

      await expect(cmdUserLogout(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdUserLogout(nats, RpcActionEnum.process, payload)).rejects.toThrow(InternalServerErrorException)
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdUserLogout(nats, RpcActionEnum.post, { ...payload, response: res })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_AUTH_CHANGE_PASSWORD, () => {
    const payload: RpcChangePasswordDto = { currentPassword: 'currentPassword', newPassword: 'newPassword', context }
    const res: RpcChangePasswordResponse = {}

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'ChangePassword', res)

      await expect(cmdChangePassword(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdChangePassword(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdChangePassword(nats, RpcActionEnum.post, { ...payload, response: {} })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })

  describe(CMD_AUTH_FORGOT_PASSWORD, () => {
    const payload: RpcForgotPasswordDto = { username: 'username', newPassword: 'newPassword', context }
    const res: RpcForgotPasswordResponse = {}

    it('should be OK', async () => {
      const { preFn, postFn, processFn } = global.rpcSpyOn(service, 'ForgotPassword', res)

      await expect(cmdForgotPassword(nats, RpcActionEnum.pre, payload)).resolves.toStrictEqual({})
      expect(preFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdForgotPassword(nats, RpcActionEnum.process, payload)).rejects.toThrow(
        InternalServerErrorException,
      )
      expect(processFn).toHaveBeenCalledWith(expectRes(payload), expect.anything())
      await expect(cmdForgotPassword(nats, RpcActionEnum.post, { ...payload, response: {} })).resolves.toStrictEqual({})
      expect(postFn).toHaveBeenCalledWith(expectRes({ ...payload, response: res }), expect.anything())
    })
  })
})
