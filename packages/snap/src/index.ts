import { OnRpcRequestHandler } from '@metamask/snaps-types';
// import { Client } from './client';
// import { getStatesByKey } from './utils';
// import { Channel } from './channel';
import router from './router';

export const onRpcRequest: OnRpcRequestHandler = (request) => {
  return router.handleRequest(request)
}
