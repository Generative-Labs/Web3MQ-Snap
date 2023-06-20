import { createRoomRequest, getRoomListRequest } from '../api';
import { getDataSignature, getWeb3MQTempKeys } from '../utils';
import { PageParams } from '../types';

export class Channel {
  static async queryChannels(option: PageParams) {
    const { PrivateKey, userid } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_signature = await getDataSignature(PrivateKey, signContent);
    const {
      data: { result = [] },
    } = await getRoomListRequest({
      web3mq_signature,
      userid,
      timestamp,
      ...option,
    });

    return result;
  }

  static async createRoom(group_name?: string, avatar_url?: string) {
    const { PrivateKey, userid } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_signature = await getDataSignature(PrivateKey, signContent);

    const { data } = await createRoomRequest({
      web3mq_signature,
      userid,
      timestamp,
      group_name,
      avatar_url,
    });
    return data;
  }
}
