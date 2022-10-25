import { Injectable } from '@nestjs/common'
import { SpanHandler } from '@nuclent/be-core'
import {
  BaseAuthRpcService,
  RpcChangePasswordDto,
  RpcChangePasswordResponse,
  RpcForgotPasswordDto,
  RpcForgotPasswordResponse,
  RpcJwksDto,
  RpcJwksResponse,
  RpcLoginDto,
  RpcLoginResponse,
  RpcLogoutDto,
  RpcLogoutResponse,
  RpcRegisterDto,
  RpcRegisterResponse,
  RpcValidateUsernameDto,
  RpcValidateUsernameResponse,
} from '@nuclent/ngage-users'

/**
 * This is service hook for Authentication module
 * https://ngage.dev.v2.nuclent.com/docs#tag/Authentication
 */
@Injectable()
export class AuthService extends BaseAuthRpcService {
  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_validateUsername */
  processValidateUsername(payload: RpcValidateUsernameDto, span: SpanHandler): Promise<RpcValidateUsernameResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_register */
  processRegister(payload: RpcRegisterDto, span: SpanHandler): Promise<RpcRegisterResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_login */
  processLogin(payload: RpcLoginDto, span: SpanHandler): Promise<RpcLoginResponse> {
    throw new Error('Method not implemented.')
  }

  /**
   * This is a special hook to get Jwks,
   * a set of keys containing the public keys
   * used to verify any JSON Web Token (JWT)
   * issued by the authorization server
   * and signed using the RS256
   */
  processJwks(payload: RpcJwksDto, span: SpanHandler): Promise<RpcJwksResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_logout */
  processLogout(payload: RpcLogoutDto, span: SpanHandler): Promise<RpcLogoutResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_changePassword */
  processChangePassword(payload: RpcChangePasswordDto, span: SpanHandler): Promise<RpcChangePasswordResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_forgotPassword */
  processForgotPassword(payload: RpcForgotPasswordDto, span: SpanHandler): Promise<RpcForgotPasswordResponse> {
    throw new Error('Method not implemented.')
  }
}
