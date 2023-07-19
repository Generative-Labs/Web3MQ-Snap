import { OnCronjobHandler, OnRpcRequestHandler } from '@metamask/snaps-types';
import router from './router';
import { fetchNewMessages } from './core/crontab';

export const onRpcRequest: OnRpcRequestHandler = (request) => {
  return router.handleRequest(request);
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'fetchNewMessages':
      return await fetchNewMessages();
    default:
      throw new Error('Method not found.');
  }
};
