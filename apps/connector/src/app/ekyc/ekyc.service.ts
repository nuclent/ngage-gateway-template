import { Injectable } from '@nestjs/common'
import { SpanHandler } from '@nuclent/be-core'
import { BaseEkycRpcService, RpcGetEkycDto, RpcGetEkycResponse } from '@nuclent/ngage-ekyc'

/**
 * This is service hook for Ekyc module
 * https://ngage.dev.v2.nuclent.com/docs#tag/eKYC
 */
@Injectable()
export class EkycService extends BaseEkycRpcService {
  /** https://ngage.dev.v2.nuclent.com/docs#tag/eKYC/operation/EkycController_getEkycData */
  processGetEkycData(
    {
      // current ekyc data nGage's storing
      current: _c,
      context: {
        // user id who make request
        userId: _u,
      },
    }: RpcGetEkycDto,
    // useful for logging request for debug purpose
    _span: SpanHandler,
  ): Promise<RpcGetEkycResponse> {
    /**
     * Should return additional ekyc data
     */
    throw new Error('Method not implemented.')
  }
}
