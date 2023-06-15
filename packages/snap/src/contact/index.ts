import { sha3_224 } from 'js-sha3';
import { Client } from '../client';
import {
  ContactListItemType,
  FollowOperationParams,
  PageParams,
  ServiceResponse,
} from '../types';
import {
  getDataSignature,
  getWeb3MQTempKeys,
  newDateFormat,
  transformAddress,
} from '../utils';
import {
  followOperationRequest,
  getContactListRequest,
  getFollowerListRequest,
  getFollowingListRequest,
  getMyFriendListRequest,
  sendFriendRequest,
} from '../api';

export class Contact {
  static async getContactList(
    option: PageParams,
  ): Promise<ContactListItemType[]> {
    const { userid, PrivateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_user_signature = await getDataSignature(
      PrivateKey,
      signContent,
    );

    const { data } = await getContactListRequest({
      userid,
      web3mq_user_signature,
      timestamp,
      ...option,
    });
    return data.user_list.filter(
      (item: ContactListItemType) => item.follow_status === 'follow_each',
    );
  }

  static async getFollowerList(
    option: PageParams,
  ): Promise<ContactListItemType[]> {
    const { userid, PrivateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_user_signature = await getDataSignature(
      PrivateKey,
      signContent,
    );
    const { data } = await getFollowerListRequest({
      web3mq_user_signature,
      userid,
      timestamp,
      ...option,
    });
    return data.user_list;
  }

  static async getFollowingList(
    option: PageParams,
  ): Promise<ContactListItemType[]> {
    const { userid, PrivateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_user_signature = await getDataSignature(
      PrivateKey,
      signContent,
    );
    const { data } = await getFollowingListRequest({
      web3mq_user_signature,
      userid,
      timestamp,
      ...option,
    });
    return data.user_list;
  }

  static async sendFriend(
    target_id: string,
    content: string = '',
  ): Promise<ServiceResponse> {
    const { userid, PrivateKey } = await getWeb3MQTempKeys();
    const target_userid = await transformAddress(target_id);
    const timestamp = Date.now();
    const signContent = userid + target_userid + content + timestamp;
    const web3mq_signature = await getDataSignature(PrivateKey, signContent);

    return await sendFriendRequest({
      content,
      web3mq_signature,
      userid,
      timestamp,
      target_userid,
    });
  }

  static async followOperation(
    params: FollowOperationParams,
  ): Promise<ServiceResponse> {
    const { address, targetUserid, action, didType } = params;
    const { userid } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    let nonce = sha3_224(userid + action + targetUserid + timestamp);
    const sign_content = `
    Web3MQ wants you to sign in with your ${didType} account:
    ${address}

    For follow signature

    Nonce: ${nonce}
    Issued At: ${newDateFormat(timestamp, 'Y/m/d h:i')}`;
    const { sign: did_signature, publicKey: did_pubkey = '' } =
      await Client.register.sign(sign_content, address, didType);
    const data = await followOperationRequest({
      did_pubkey,
      did_signature,
      sign_content,
      userid,
      timestamp,
      address,
      action,
      did_type: didType,
      target_userid: targetUserid,
    });
    return data as any;
  }

  static async getMyFriendRequestList(option: PageParams) {
    const { userid, PrivateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_signature = await getDataSignature(PrivateKey, signContent);

    const {
      data: { result = [] },
    } = await getMyFriendListRequest({
      web3mq_signature,
      userid,
      timestamp,
      ...option,
    });
    return result;
  }
}
