import { OnRpcRequestHandler } from '@metamask/snaps-types';
import router from './router';

export const onRpcRequest: OnRpcRequestHandler = (request) => {
  return router.handleRequest(request)
}
