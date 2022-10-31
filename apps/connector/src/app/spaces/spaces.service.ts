import { Injectable } from '@nestjs/common'
import { SpanHandler } from '@nuclent/be-core'
import {
  BaseRpcSpaceService,
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
} from '@nuclent/ngage-spaces'

/**
 * This is service hook for Spaces module
 * https://ngage.dev.v2.nuclent.com/docs#tag/Spaces
 */
@Injectable()
export class SpacesService extends BaseRpcSpaceService {
  /** https://ngage.dev.v2.nuclent.com/docs#tag/Spaces/operation/SpacesController_getSpaces */
  processGetSpaces(
    {
      // current space data nGage's storing
      current: _c,
      context: {
        // user id who make request
        userId: _u,
      },
    }: RpcGetSpacesDto,
    // useful for logging request for debug purpose
    _span: SpanHandler,
  ): Promise<RpcGetSpacesResponse> {
    /**
     * Should return additional account/space data array follow order of current param, especially balances info.
     * nGage isn't storing any balances info to avoid out-synced balances
     *
     * Ex:
     * -> params: current = [
     *         { id: 'space1',... },
     *         { id: 'space2',... }
     *    ]
     * -> should return {
     *        data: [
     *          { <additional for space 1>, balances: <balance info for space 1> },
     *          { <additional for space 2>, balances: <balance info for space 2> }
     *        ]
     *    }
     */
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Spaces/operation/SpacesController_createSpace */
  processCreateSpace(
    {
      // create space payload
      payload: _p,
      // same as above
      context: _c,
    }: RpcCreateSpaceDto,
    // same as above
    _span: SpanHandler,
  ): Promise<RpcCreateSpaceResponse> {
    /**
     * Should return id and externalId for nGage to store space data.
     * Normally id and externalId are the same value point to account reference id of core banking
     */
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Spaces/operation/SpacesController_getSpaceById */
  processGetSpaceById(
    {
      // space id to get
      id: _i,
      // current data nGage storing
      current: _cur,
      context: _c,
    }: RpcGetSpaceByIdDto,
    _span: SpanHandler,
  ): Promise<RpcGetSpaceByIdResponse> {
    /**
     * should return additional space info and space balances info
     */
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Spaces/operation/SpacesController_deleteSpace */
  processDeleteSpace(
    {
      // space id to delete
      id: _i,
      // current data nGage storing
      current: _cur,
      context: _c,
    }: RpcDeleteSpaceDto,
    _span: SpanHandler,
  ): Promise<RpcDeleteSpaceResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Spaces/operation/SpacesController_updateSpace */
  processUpdateSpace(
    {
      id: _i,
      current: _cur,
      // update payload data
      payload: _p,
      context: _c,
    }: RpcUpdateSpaceDto,
    _span: SpanHandler,
  ): Promise<RpcUpdateSpaceResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Spaces/operation/SpacesController_balance */
  processGetBalance(
    {
      // all current spaces info nGage is storing
      current: _cur,
      context: _c,
    }: RpcGetBalanceDto,
    _span: SpanHandler,
  ): Promise<RpcGetBalanceResponse> {
    /**
     * Should return total balances for each currency
     * Ex: {
     *    data: {
     *      VND: { balances: 1000000, sharedBalance: 200000 },
     *      USD: { balances: 1000, sharedBalance: 0 }
     *    }
     * }
     */
    throw new Error('Method not implemented.')
  }
}
