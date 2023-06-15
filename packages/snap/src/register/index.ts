import { sha3_224 } from 'js-sha3';
import * as ed from '@noble/ed25519';
import {
  ByteArrayToHexString,
  GenerateEd25519KeyPair,
  getCurrentDate,
  getDataSignature,
  getStatesByKey,
  saveStates,
  sha256,
} from '../utils';
import {
  aesGCMDecrypt,
  aesGCMEncrypt,
  Base64StringToUint8,
  GetAESBase64Key,
  Uint8ToBase64String,
} from '../encryption';
import {
  getUserInfoRequest,
  userLoginRequest,
  userRegisterRequest,
} from '../api';
import {
  GetMainKeypairParams,
  GetUserInfoParams,
  LoginByKeysParams,
  LoginApiParams,
  RegisterBySignParams,
  RegisterParams,
  WalletNameMap,
  WalletSignRes,
  WalletType,
  LoginResponse,
  GetUserInfoResponse,
  GetSignContentResponse,
  GetRegisterSignContentParams,
  MainKeypairType,
  AccountType,
} from '../types';
import { getEthAccount, signWithEth } from './eth';

export class Register {
  appKey: string;

  pubicKeyType = 'ed25519';

  registerTime: number;

  registerSignContent: string;

  constructor(appKey?: string) {
    this.appKey = appKey || '';
    this.registerTime = 0;
    this.registerSignContent = '';
  }

  getUserInfo = async (
    options: Omit<GetUserInfoParams, 'timestamp'>,
  ): Promise<GetUserInfoResponse> => {
    let userid = '';
    let userExist = false;

    const { did_type, did_value } = options;
    const timestamp = Date.now();

    try {
      const { data } = await getUserInfoRequest({
        did_type,
        did_value,
        timestamp,
      });
      userid = data.userid;
      if (data.main_pubkey) {
        userExist = true;
      }
    } catch (error) {
      userid = `user:${sha3_224(did_type + did_value + timestamp)}`;
      userExist = false;
    }
    return {
      userid,
      userExist,
    };
  };

  getMainKeypair = async (
    options: GetMainKeypairParams,
  ): Promise<{ publicKey: string; secretKey: string }> => {
    const { password, did_value, did_type } = options;
    const { signContent } = await this.getMainKeypairSignContent(options);
    const { sign: signature } = await this.sign(
      signContent,
      did_value,
      did_type,
    );
    console.log(signature, 'signature - getMainKeypair');
    return await this.getMainKeypairBySignature(signature, password);
  };

  register = async (options: RegisterBySignParams) => {
    const {
      userid,
      didValue,
      mainPublicKey,
      signature,
      did_pubkey = '',
      didType = 'eth',
      nickname = '',
      avatar_url = '',
      avatar_base64 = '',
    } = options;
    if (!this.registerTime || !this.registerSignContent) {
      throw new Error('Please create register sign content first!');
    }

    const payload: RegisterParams = {
      userid,
      did_type: didType,
      did_value: didValue,
      did_pubkey,
      did_signature: signature,
      signature_content: this.registerSignContent,
      pubkey_type: this.pubicKeyType,
      pubkey_value: mainPublicKey,
      nickname,
      avatar_url,
      avatar_base64,
      timestamp: this.registerTime,
      testnet_access_key: this.appKey,
    };

    try {
      return await userRegisterRequest(payload);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  login = async (options: LoginByKeysParams): Promise<LoginResponse> => {
    const {
      password,
      userid,
      didValue,
      didType = 'eth',
      mainPrivateKey,
      mainPublicKey,
      pubkeyExpiredTimestamp = Date.now() + 86400 * 1000,
    } = options;
    try {
      const timestamp = Date.now();

      const { PublicKey, PrivateKey } = await GenerateEd25519KeyPair();

      const signContent = sha3_224(
        userid + PublicKey + pubkeyExpiredTimestamp + timestamp,
      );
      const AesKey = await GetAESBase64Key(password);
      const AesIv = AesKey.slice(0, 16);
      const decode_data = await aesGCMDecrypt(
        AesKey,
        AesIv,
        Base64StringToUint8(mainPrivateKey),
      );
      const decode_dataStr = new TextDecoder().decode(
        new Uint8Array(decode_data),
      );
      const login_signature = await getDataSignature(
        decode_dataStr,
        signContent,
      );

      const payload: LoginApiParams = {
        userid,
        did_type: didType,
        did_value: didValue,
        login_signature,
        signature_content: signContent,
        main_pubkey: mainPublicKey,
        pubkey_value: PublicKey,
        pubkey_type: 'ed25519',
        timestamp,
        pubkey_expired_timestamp: pubkeyExpiredTimestamp,
      };
      const loginRes = await userLoginRequest(payload);
      console.log(loginRes, 'loginRes');
      return {
        tempPrivateKey: PrivateKey,
        tempPublicKey: PublicKey,
        mainPrivateKey,
        mainPublicKey,
        pubkeyExpiredTimestamp,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  sign = async (
    signContent: string,
    address: string,
    walletType: WalletType,
  ): Promise<WalletSignRes> => {
    switch (walletType) {
      default:
        return signWithEth(signContent, address);
    }
  };

  getAccount = async (walletType: WalletType): Promise<AccountType> => {
    switch (walletType) {
      default:
        return await getEthAccount();
    }
  };

  connectWallet = async (walletType: WalletType): Promise<AccountType> => {
    switch (walletType) {
      default:
        return await getEthAccount();
    }
  };

  getMainKeypairSignContent = async (
    options: GetMainKeypairParams,
  ): Promise<GetSignContentResponse> => {
    const { password, did_value, did_type } = options;
    const keyIndex = 1;
    const keyMSG = `${did_type}:${did_value}${keyIndex}${password}`;

    const magicString = Uint8ToBase64String(
      new TextEncoder().encode(sha3_224(`$web3mq${keyMSG}web3mq$`)),
    );

    const signContent = `Signing this message will allow this app to decrypt messages in the Web3MQ protocol for the following address: ${did_value}. This won’t cost you anything.

If your Web3MQ wallet-associated password and this signature is exposed to any malicious app, this would result in exposure of Web3MQ account access and encryption keys, and the attacker would be able to read your messages.

In the event of such an incident, don’t panic. You can call Web3MQ’s key revoke API and service to revoke access to the exposed encryption key and generate a new one!

Nonce: ${magicString}`;

    return { signContent };
  };

  getMainKeypairBySignature = async (
    signature: string,
    password: string,
  ): Promise<MainKeypairType> => {
    const secretKey = sha256(signature);

    if (secretKey.length !== 32) {
      throw new Error('Secret key must have 32 bytes');
    }
    console.log('hahahaha-----');
    const publicKey = await ed.getPublicKey(secretKey);
    console.log('hahahaha-----======');
    const AesKey = await GetAESBase64Key(password);
    const AesIv = AesKey.slice(0, 16);
    const encrytData = await aesGCMEncrypt(
      AesKey,
      AesIv,
      new TextEncoder().encode(ByteArrayToHexString(secretKey)),
    );
    const encrytDataStr = Uint8ToBase64String(new Uint8Array(encrytData));

    return {
      publicKey: ByteArrayToHexString(publicKey),
      secretKey: encrytDataStr,
    };
  };

  getRegisterSignContent = async (
    options: GetRegisterSignContentParams,
  ): Promise<GetSignContentResponse> => {
    const {
      mainPublicKey,
      didType,
      didValue,
      userid,
      signContentURI = 'Web3MQ - snaps',
    } = options;

    const wallet_type_name = WalletNameMap[didType];
    const pubkey_type = this.pubicKeyType;
    const timestamp = Date.now();
    const NonceContent = sha3_224(
      userid + pubkey_type + mainPublicKey + didType + didValue + timestamp,
    );

    const signContent = `Web3MQ wants you to sign in with your ${wallet_type_name} account:
${didValue}
For Web3MQ register
URI: ${signContentURI}
Version: 1

Nonce: ${NonceContent}
Issued At: ${getCurrentDate()}`;

    this.registerSignContent = signContent;
    this.registerTime = timestamp;
    return { signContent };
  };

  async connectWeb3MQNetwork(params: { password: string; nickname?: string }) {
    const { password, nickname = '' } = params;
    let mainPubKey = '';
    let mainPriKey = '';
    const localAddress = (await getStatesByKey('WALLET_ADDRESS')) as string;
    const { address } = await this.getAccount('eth');
    if (
      localAddress &&
      localAddress.toLocaleLowerCase() === address.toLocaleLowerCase()
    ) {
      mainPriKey = (await getStatesByKey('MAIN_PRIVATE_KEY')) as string;
      mainPubKey = (await getStatesByKey('MAIN_PUBLIC_KEY')) as string;
    }
    console.log(mainPriKey, 'mainPriKey - local');
    console.log(mainPubKey, 'mainPubKey - local');
    const did_type: WalletType = 'eth';
    const { userid, userExist } = await this.getUserInfo({
      did_type,
      did_value: address,
    });
    if (!mainPubKey || !mainPriKey) {
      const { publicKey, secretKey } = await this.getMainKeypair({
        password,
        did_value: address,
        did_type,
      });
      mainPriKey = secretKey;
      mainPubKey = publicKey;
    }
    if (!userExist) {
      const { signContent } = await this.getRegisterSignContent({
        userid,
        mainPublicKey: mainPubKey,
        didType: did_type,
        didValue: address,
      });
      const { sign: signRes, publicKey: did_pubkey = '' } = await this.sign(
        signContent,
        address,
        did_type,
      );
      await this.register({
        userid,
        didValue: address,
        mainPublicKey: mainPubKey,
        did_pubkey,
        didType: did_type,
        nickname,
        avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
        signature: signRes,
      });
      // const pubkey_type = this.pubicKeyType;
      // const timestamp = Date.now();
      // const NonceContent = sha3_224(
      //   userid + pubkey_type + mainPubKey + did_type + address + timestamp,
      // );
      // const signContent = `Web3MQ wants you to sign in with your Ethereum account:
      //   ${address}
      //   For Web3MQ register
      //   Version: 1
      //
      //   Nonce: ${NonceContent}
      //   Issued At: ${getCurrentDate()}`;
      // const { sign: signRes, publicKey: did_pubkey = '' } = await this.sign(
      //   signContent,
      //   address,
      //   did_type,
      // );
      // this.registerSignContent = signContent
      // // await this.register({
      // //   userid,
      // //   didValue: address,
      // //   mainPublicKey: mainPubKey,
      // //   did_pubkey,
      // //   didType: did_type,
      // //   nickname,
      // //   avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
      // //   signature: signRes,
      // // });
      // const payload: RegisterParams = {
      //   userid,
      //   did_type,
      //   did_value: address,
      //   did_pubkey,
      //   did_signature: signRes,
      //   signature_content: this.registerSignContent,
      //   pubkey_type: this.pubicKeyType,
      //   pubkey_value: mainPubKey,
      //   nickname,
      //   avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
      //   avatar_base64: '',
      //   timestamp,
      //   testnet_access_key: this.appKey,
      // };
      //
      // try {
      //   console.log(
      //     JSON.stringify(payload),
      //     'request to /api/user_register_v2/',
      //   );
      //   return await userRegisterRequest(payload);
      // } catch (error: any) {
      //   console.error(error, 'userRegisterRequest error');
      //   throw new Error(error.message);
      // }
    }

    if (mainPriKey && mainPubKey) {
      const {
        tempPrivateKey,
        tempPublicKey,
        pubkeyExpiredTimestamp,
        mainPrivateKey,
        mainPublicKey,
      } = await this.login({
        mainPrivateKey: mainPriKey,
        mainPublicKey: mainPubKey,
        password,
        didType: did_type,
        didValue: address,
        userid,
      });
      await saveStates('userid', userid);
      await saveStates('PRIVATE_KEY', tempPrivateKey);
      await saveStates('PUBLIC_KEY', tempPublicKey);
      await saveStates('WALLET_ADDRESS', address);
      await saveStates(`MAIN_PRIVATE_KEY`, mainPriKey);
      await saveStates(`MAIN_PUBLIC_KEY`, mainPubKey);
      await saveStates(`DID_KEY`, `${did_type}:${address}`);
      await saveStates(
        'PUBKEY_EXPIRED_TIMESTAMP',
        String(pubkeyExpiredTimestamp),
      );
    }
    console.log('main keys create error');
    return null;
  }
}
