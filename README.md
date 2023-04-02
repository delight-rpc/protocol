# @delight-rpc/protocol
## Install
```sh
npm install --save @delight-rpc/protocol
# or
yarn add @delight-rpc/protocol
```

## Protocol
```ts
const version = '3.1'

/**
 * The reason why it is divided into two fields
 * is to make it easier to distinguish
 * when sharing channels with other protocols.
 * 
 * Reducing the size of payloads is not the goal of Delight RPC.
 */
interface IDelightRPC {
  protocol: 'delight-rpc'
  version: `3.${number}`

  /**
   * An identifier used to offload multiple different RPC instances
   * over a communication channel.
   */
  channel?: string

  [key: string]: unknown
}

// =================== Client -> Server ===================

interface IRequest<T> extends IDelightRPC {
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

/**
 * The new type of message sent by clients to servers since 3.1.
 * Servers with protocol versions lower than 3.1 will simply ignore these messages.
 */
interface IAbort extends IDelightRPC {
  id: string
  abort: true
}

interface IBatchRequest<T> extends IDelightRPC {
  id: string

  /**
   * The expected server semver.
   */
  expectedVersion?: Nullable<string>

  parallel: boolean

  requests: Array<IRequestForBatchRequest<unknown, T>>
}

interface IRequestForBatchRequest<Result, DataType> {
  method: string[]
  params: DataType[]
}

// =================== Server -> Client ===================

type IResponse<T> = IResult<T> | IError

interface IResult<T> extends IDelightRPC {
  id: string
  result: T
}

interface IError extends IDelightRPC {
  id: string
  error: SerializableError
}

interface IBatchResponse<DataType> extends IDelightRPC {
  id: string
  responses: Array<
  | IResultForBatchResponse<DataType>
  | IErrorForBatchResponse
  >
}

interface IResultForBatchResponse<T> {
  result: T
}

interface IErrorForBatchResponse {
  error: SerializableError
}
```
