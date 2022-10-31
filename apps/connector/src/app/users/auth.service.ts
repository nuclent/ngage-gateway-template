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
  processValidateUsername(
    {
      // username to validate
      username: _u,
    }: RpcValidateUsernameDto,
    // useful for logging request for debug purpose
    _span: SpanHandler,
  ): Promise<RpcValidateUsernameResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_register */
  processRegister(
    // register account payload
    _payload: RpcRegisterDto,
    _span: SpanHandler,
  ): Promise<RpcRegisterResponse> {
    /**
     * Should return new user id and status for nGage to store new user information
     */
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_login */
  processLogin(_payload: RpcLoginDto, _span: SpanHandler): Promise<RpcLoginResponse> {
    throw new Error('Method not implemented.')
  }

  /**
   * This is a special hook to get Jwks,
   * a set of keys containing the public keys
   * used to verify any JSON Web Token (JWT)
   * issued by the authorization server
   * and signed using the RS256
   */
  processJwks(_payload: RpcJwksDto, _span: SpanHandler): Promise<RpcJwksResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_logout */
  processLogout(_payload: RpcLogoutDto, _span: SpanHandler): Promise<RpcLogoutResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_changePassword */
  processChangePassword(_payload: RpcChangePasswordDto, _span: SpanHandler): Promise<RpcChangePasswordResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Authentication/operation/AuthController_forgotPassword */
  processForgotPassword(_payload: RpcForgotPasswordDto, _span: SpanHandler): Promise<RpcForgotPasswordResponse> {
    throw new Error('Method not implemented.')
  }
}
