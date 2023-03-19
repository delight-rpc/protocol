import type { Nullable } from '@blackglory/prelude'
import type { SerializableError } from '@blackglory/errors'

export const version = '3.0'

/**
 * The reason why it is divided into two fields
 * is to make it easier to distinguish
 * when sharing channels with other protocols.
 * 
 * Reducing the size of payloads is not the goal of Delight RPC.
 */
export interface IDelightRPC {
  protocol: 'delight-rpc'
  version: `3.${number}`

  /**
   * An identifier used to offload multiple different RPC instances
   * over a communication channel.
   */
  channel?: string

  [key: string]: unknown
}

export interface IRequest<T> extends IDelightRPC {
  id: string

  /**
   * The expected server semver.
   */
  expectedVersion?: Nullable<string>
  
  /**
   * The `method` field can include the namespace it belongs to.
   * For example, `['config','save']` represents the `save` method
   * under the namespace `config`.
   */
  method: string[]
  params: T[]
}

export type IResponse<T> = IResult<T> | IError

export interface IResult<T> extends IDelightRPC {
  id: string
  result: T
}

export interface IError extends IDelightRPC {
  id: string
  error: SerializableError
}

export interface IBatchRequest<T> extends IDelightRPC {
  id: string

  /**
   * The expected server semver.
   */
  expectedVersion?: Nullable<string>

  parallel: boolean

  requests: Array<IRequestForBatchRequest<unknown, T>>
}

export interface IBatchResponse<DataType> extends IDelightRPC {
  id: string
  responses: Array<
  | IResultForBatchResponse<DataType>
  | IErrorForBatchResponse
  >
}

export interface IRequestForBatchRequest<Result, DataType> {
  method: string[]
  params: DataType[]
}

export interface IResultForBatchResponse<T> {
  result: T
}

export interface IErrorForBatchResponse {
  error: SerializableError
}
