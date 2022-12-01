import { Injectable } from '@nestjs/common'
import { SpanHandler } from '@nuclent/be-core'
import {
  BaseRpcTransactionService,
  RpcCreateTransactionDto,
  RpcCreateTransactionResponse,
  RpcGetTransactionByIdDto,
  RpcGetTransactionByIdResponse,
  RpcListTransactionsDto,
  RpcListTransactionsResponse,
  RpcSearchTransactionsDto,
  RpcSearchTransactionsResponse,
  RpcUpdateTransactionDto,
  RpcUpdateTransactionResponse,
} from '@nuclent/ngage-statistics'

/**
 * This is service hook for Transactions module
 * https://ngage.dev.v2.nuclent.com/docs#tag/Statistics
 */
@Injectable()
export class TransactionsService extends BaseRpcTransactionService {
  /** https://ngage.dev.v2.nuclent.com/docs#tag/Statistics/operation/TransactionsController_getTransaction */
  processGetTransactionById(
    _payload: RpcGetTransactionByIdDto,
    _span: SpanHandler,
  ): Promise<RpcGetTransactionByIdResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Statistics/operation/TransactionsController_create */
  processCreateTransaction(
    _payload: RpcCreateTransactionDto,
    _span: SpanHandler,
  ): Promise<RpcCreateTransactionResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Statistics/operation/TransactionsController_update */
  processUpdateTransaction(
    _payload: RpcUpdateTransactionDto,
    _span: SpanHandler,
  ): Promise<RpcUpdateTransactionResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Statistics/operation/TransactionsController_logs */
  processListTransactions(_payload: RpcListTransactionsDto, _span: SpanHandler): Promise<RpcListTransactionsResponse> {
    throw new Error('Method not implemented.')
  }

  /** https://ngage.dev.v2.nuclent.com/docs#tag/Statistics/operation/TransactionsController_searchLog */
  processSearchTransactions(
    _payload: RpcSearchTransactionsDto,
    _span: SpanHandler,
  ): Promise<RpcSearchTransactionsResponse> {
    throw new Error('Method not implemented.')
  }
}
