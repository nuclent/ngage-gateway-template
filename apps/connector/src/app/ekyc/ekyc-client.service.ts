import { Injectable } from '@nestjs/common'
import { SpanHandler } from '@nuclent/be-core'
import {
  BaseClientEkycRpcService,
  RpcPollingDto,
  RpcPollingResponse,
  RpcRequestIdDto,
  RpcRequestIdResponse,
  RpcUploadPhotoDto,
  RpcUploadPhotoResponse,
  RpcVerifyOcrDto,
  RpcVerifyOcrResponse,
} from '@nuclent/ngage-ekyc'

/**
 * This is service hook for Client Ekyc module - use for proxy or connect to third parties ekyc service
 * https://ngage.dev.v2.nuclent.com/docs#tag/eKYC
 */
@Injectable()
export class ClientEkycService extends BaseClientEkycRpcService {
  /**
   * https://ngage.dev.v2.nuclent.com/docs#tag/eKYC/operation/ClientEkycController_postRequestId
   * Start client ekyc session
   */
  processRequestId(_payload: RpcRequestIdDto, _span: SpanHandler): Promise<RpcRequestIdResponse> {
    throw new Error('Method not implemented.')
  }

  /**
   * https://ngage.dev.v2.nuclent.com/docs#tag/eKYC/operation/ClientEkycController_polling
   * Handle polling client ekyc session's status
   */
  processPolling(_payload: RpcPollingDto, _span: SpanHandler): Promise<RpcPollingResponse> {
    throw new Error('Method not implemented.')
  }

  /**
   * https://ngage.dev.v2.nuclent.com/docs#tag/eKYC/operation/ClientEkycController_uploadImageDoc
   * Handle photo upload for ekyc session
   */
  processUploadPhoto(
    {
      // image's step
      step: _s,
      // current session id
      requestId: _i,
      // upload file reference, use for processing file, passing through ekyc client
      fileRef: _f,
    }: RpcUploadPhotoDto,
    _span: SpanHandler,
  ): Promise<RpcUploadPhotoResponse> {
    throw new Error('Method not implemented.')
  }

  /**
   * https://ngage.dev.v2.nuclent.com/docs#tag/eKYC/operation/ClientEkycController_verifyOcr
   * Handle user/app submit ocr result to finish ekyc session
   */
  processVerifyOcr(_payload: RpcVerifyOcrDto, _span: SpanHandler): Promise<RpcVerifyOcrResponse> {
    throw new Error('Method not implemented.')
  }
}
