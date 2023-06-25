import { PageParams, SendMessageParams } from '../types';
import {
  GenerateMessageID,
  getDataSignature,
  getWeb3MQTempKeys,
  renderMessagesList,
  transformAddress,
} from '../utils';
import {
  getMessageListRequest,
  getNodeInfoRequest,
  searchUsersRequest,
  sendMessageRequest,
} from '../api';
import { Uint8ArrayToBase64String } from '../encryption';

export class Message {
  static async getMessageList(option: PageParams, topic: string) {
    const { privateKey, userid } = await getWeb3MQTempKeys();
    const contentTopic = await transformAddress(topic);
    if (contentTopic) {
      const timestamp = Date.now();
      const msg = userid + contentTopic + timestamp;
      const web3mq_signature = await getDataSignature(privateKey, msg);
      const {
        data: { result = [] },
      } = await getMessageListRequest({
        userid,
        timestamp,
        web3mq_signature,
        topic: contentTopic,
        ...option,
      });
      const data = await renderMessagesList(result);
      return data.reverse() || [];
    }
  }

  static async getTargetUserId(address: string) {
    const { privateKey, userid } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const msg = userid + address + timestamp;
    const web3mq_signature = await getDataSignature(privateKey, msg);
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

  static async sendMessage(msg: string, targetTopic: string) {
    console.log('sendMessage Called');
    const { userid, privateKey } = await getWeb3MQTempKeys();
    const topic = await transformAddress(targetTopic);
    if (!topic) {
      throw new Error('topic error');
    }
    const timestamp = Date.now();

    const { data } = await getNodeInfoRequest();
    const nodeId = data.Id || '';

    const cipherSuite = 'NONE';
    const byteData = new TextEncoder().encode(msg);
    console.log(byteData, 'byteData');

    const msgid = await GenerateMessageID(userid, topic, timestamp, byteData);
    const signContent = msgid + userid + topic + nodeId + timestamp.toString();
    const web3mq_user_signature = await getDataSignature(
      privateKey,
      signContent,
    );

    const msgReq: SendMessageParams = {
      nodeid: nodeId,
      payload_type: 'text/plain; charset=utf-8',
      payload: Uint8ArrayToBase64String(byteData),
      need_store: true,
      cipher_suite: cipherSuite,
      content_topic: topic,
      messageid: msgid,
      userid,
      timestamp,
      web3mq_user_signature,
    };

    const res = await sendMessageRequest(msgReq);
    console.log(res, 'res');
    return res;
  }
}
