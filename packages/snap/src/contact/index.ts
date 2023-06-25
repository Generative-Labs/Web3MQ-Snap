import { sha3_224 } from 'js-sha3';
import {
  ContactListItemType,
  FollowOperationParams,
  GetFollowSignContentParams,
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
    const { userid, privateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_user_signature = await getDataSignature(
      privateKey,
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
    const { userid, privateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_user_signature = await getDataSignature(
      privateKey,
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
    const { userid, privateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_user_signature = await getDataSignature(
      privateKey,
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
    targetId: string,
    content: string = '',
  ): Promise<ServiceResponse> {
    const { userid, privateKey } = await getWeb3MQTempKeys();
    const target_userid = await transformAddress(targetId);
    const timestamp = Date.now();
    const signContent = userid + target_userid + content + timestamp;
    const web3mq_signature = await getDataSignature(privateKey, signContent);

    return await sendFriendRequest({
      content,
      web3mq_signature,
      userid,
      timestamp,
      target_userid,
    });
  }

  static async getFollowSignContent(params: GetFollowSignContentParams) {
    const { walletAddress, targetUserid, action, walletType } = params;
    const { userid } = await getWeb3MQTempKeys();
    const signTimestamp = Date.now();
    let nonce = sha3_224(userid + action + targetUserid + signTimestamp);
    const signContent = `
    Web3MQ wants you to sign in with your ${walletType} account:
    ${walletAddress}

    For follow signature

    Nonce: ${nonce}
    Issued At: ${newDateFormat(signTimestamp, 'Y/m/d h:i')}`;
    return { signContent, signTimestamp };
  }

  static async followOperation(
    params: FollowOperationParams,
  ): Promise<ServiceResponse> {
    const {
      targetId,
      action,
      walletType = 'eth',
      signature,
      signContent,
      signTimestamp,
      didPubKey ='',
    } = params;
    const { userid, walletAddress } = await getWeb3MQTempKeys();
    const target_userid = await transformAddress(targetId);
    const data = await followOperationRequest({
      did_pubkey: didPubKey,
      did_signature: signature,
      sign_content: signContent,
      userid,
      timestamp: signTimestamp,
      address: walletAddress,
      action,
      did_type: walletType,
      target_userid,
    });
    return data as any;
  }

  static async getMyFriendRequestList(option: PageParams) {
    const { userid, privateKey } = await getWeb3MQTempKeys();
    const timestamp = Date.now();
    const signContent = userid + timestamp;
    const web3mq_signature = await getDataSignature(privateKey, signContent);

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
