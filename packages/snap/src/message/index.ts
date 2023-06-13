import { PageParams } from '../types';
import {
  getDataSignature,
  getWeb3MQTempKeys,
  renderMessagesList,
} from '../utils';
import { getMessageListRequest, searchUsersRequest } from '../api';

export class Message {
  static async getMessageList(option: PageParams, topic: string) {
    const { PrivateKey, userid } = await getWeb3MQTempKeys();
    if (topic) {
      const timestamp = Date.now();
      const msg = userid + topic + timestamp;
      const web3mq_signature = await getDataSignature(PrivateKey, msg);
      const {
        data: { result = [] },
      } = await getMessageListRequest({
        userid,
        timestamp,
        web3mq_signature,
        topic,
        ...option,
      });
      const data = await renderMessagesList(result);
      return data.reverse() || [];
    }
  }

  static async getTargetUserId(address: string) {
    const { PrivateKey, userid } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const msg = userid + address + timestamp;
    const web3mq_signature = await getDataSignature(PrivateKey, msg);
    const {
      data: { result = [] },
    } = await searchUsersRequest({
      userid,
      timestamp,
      web3mq_signature,
      keyword: address,
    });
    return result;
  }

  // async sendMessage(msg: string, userId?: string) {
  //   const { keys } = this._client;
  //   const topicId = userId && (await transformAddress(userId));
  //
  //   if (topicId) {
  //     this.msg_text = msg;
  //     const { concatArray } = await sendMessageCommand(keys, topicId, msg, connect.nodeId);
  //     connect.send(concatArray);
  //     return true;
  //   }
  // }
}
