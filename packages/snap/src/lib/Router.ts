import { Json, JsonRpcRequest } from "@metamask/snaps-types";


export type SnapRpcPayload = Json[] | Record<string, Json>

/**
 *
 * @example {"jsonrpc":"2.0","id":"EpaBElurfNrb6v-FRxc8o","method":"user","params":{"password":"daohaoqu4","nickname":"testAccount"}}
 */
export type SnapRpcRequest = {
  origin: string;
  request: JsonRpcRequest<SnapRpcPayload>;
}

export type Route = {
  path: string
  handler: (params: any) => Promise<any>
  middleware: any
}
/**
 * Snaps JSON-RPC API Router
 * @see https://docs.metamask.io/snaps/reference/rpc-api/
 *
 */
export class SnapRouter {
  private stack: Route[] = []

  constructor() {
    this.handleRequest.bind(this)
  }

  private register(path: string, handler: any, middleware?: any) {
    const { stack } = this
    stack.push({
      path,
      handler,
      middleware,
    })
  }

  use(path: string, handler: any, middleware?: any) {
    this.register(path, handler, middleware)
    return this;
  }

  async handleRequest(request_: SnapRpcRequest) {
    const { request } = request_;
    const { method, params } = request
    const target = this.stack.find(route => route.path === method)
    if (target?.handler) {
      return target.handler(params);
    } else {
      throw new Error('Route not found');
    }
  }
}
