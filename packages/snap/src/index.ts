import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { Client } from './client';
import { getStatesByKey } from './utils';
import { Channel } from './channel';
export const onRpcRequest: OnRpcRequestHandler = async ({ request }: any) => {
  let payload;
  if (request.params) {
    payload = request.params;
  }
  switch (request.method) {
    case 'creatRoom':
      try {
        const { group_name = '', avatar_url = '' } = payload;
        return await Channel.createRoom(group_name, avatar_url);
      } catch (e) {
        throw new Error(e);
      }
    case 'getChannelList':
      try {
        const { options } = payload;
        console.log(options, 'options');
        return await Channel.queryChannels(options);
      } catch (e) {
        throw new Error(e);
      }
    // case 'getTargetUserId':
    //   try {
    //     const { address } = payload;
    //     // @ts-ignore
    //     return await wallet.client.message.getTargetUserId(address);
    //   } catch (error) {
    //     // @ts-ignore
    //     throw new Error(error);
    //   }
    // case 'sendMessage':
    //   try {
    //     const { msg, topic } = payload;
    //     // @ts-ignore
    //     return await wallet.client.message.sendMessage(msg, topic);
    //   } catch (error) {
    //     // @ts-ignore
    //     throw new Error(error);
    //   }
    // case 'getMessageList':
    //   try {
    //     const { options, topic } = payload;
    //     // @ts-ignore
    //     return await wallet.client.message.getMessageList(options, topic);
    //   } catch (error) {
    //     // @ts-ignore
    //     throw new Error(error);
    //   }
    case 'sendNotifyMessage':
      try {
        const { message } = payload;
        return await snap.request({
          method: 'snap_notify',
          params: {
            type: 'inApp',
            message,
          },
        });
      } catch (error) {
        throw new Error(error);
      }
      break;
    case 'connectToWeb3MQ':
      try {
        const { password, nickname } = payload;
        await Client.init({ env: 'dev' });
        const url = (await getStatesByKey('FAST_URL')) || '';
        await Client.register.connectWeb3MQNetwork({
          password,
          nickname,
        });
      } catch (e: any) {
        throw new Error(e);
      }
      break;
    default:
      throw new Error('Method not found.');
  }
};
