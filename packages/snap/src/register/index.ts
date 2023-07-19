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
  ConnectToWeb3MQParams,
  GetRegisterSignContentResponse,
  RegisterToWeb3MQParams,
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
      return {
        tempPrivateKey: PrivateKey,
        tempPublicKey: PublicKey,
        mainPrivateKey,
        mainPublicKey,
        pubkeyExpiredTimestamp,
      };
    } catch (error: any) {
      console.log(error, 'error');
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
    const publicKey = await ed.getPublicKey(secretKey);
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
  ): Promise<GetRegisterSignContentResponse> => {
    const {
      mainPublicKey,
      walletType,
      walletAddress,
      userid,
      signContentURI = 'Web3MQ - snaps',
    } = options;

    const wallet_type_name = WalletNameMap[walletType];
    const pubkey_type = this.pubicKeyType;
    const timestamp = Date.now();
    const NonceContent = sha3_224(
      userid + pubkey_type + mainPublicKey + walletType + walletAddress + timestamp,
    );

    const signContent = `Web3MQ wants you to sign in with your ${wallet_type_name} account:
${walletAddress}
For Web3MQ register
URI: ${signContentURI}
Version: 1

Nonce: ${NonceContent}
Issued At: ${getCurrentDate()}`;

    this.registerSignContent = signContent;
    this.registerTime = timestamp;
    return { signContent, registerTime: timestamp };
  };

  async registerToWeb3MQNetwork(payload: RegisterToWeb3MQParams) {
    const {
      walletType = 'eth',
      walletAddress,
      mainPublicKey,
      mainPrivateKey,
      nickname,
      avatarUrl,
      didPubkey,
      registerTime,
      registerSignContent,
      signature,
      password,
      userid,
    } = payload;

    const params: RegisterParams = {
      userid,
      did_type: walletType,
      did_value: walletAddress,
      did_pubkey: didPubkey,
      did_signature: signature,
      signature_content: registerSignContent,
      pubkey_type: this.pubicKeyType,
      pubkey_value: mainPublicKey,
      nickname,
      avatar_url: avatarUrl,
      avatar_base64: '',
      timestamp: registerTime,
      testnet_access_key: this.appKey,
    };
    try {
      await userRegisterRequest(params);
      await this.connectWeb3MQNetwork({
        walletType: walletType,
        walletAddress,
        mainPublicKey,
        mainPrivateKey,
        password,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async connectWeb3MQNetwork(params: ConnectToWeb3MQParams) {
    const {
      walletType = 'eth',
      walletAddress,
      mainPublicKey,
      mainPrivateKey,
      password,
    } = params;
    let userid = params.userid;
    if (!userid) {
      const userInfo = await this.getUserInfo({
        did_value: walletAddress,
        did_type: walletType,
      });
      userid = userInfo.userid;
    }
    if (!userid) {
      throw new Error('User not registered');
    }
    const localAddress = (await getStatesByKey('WALLET_ADDRESS')) as string;
    let pubKey = '';
    let priKey = '';
    if (
      localAddress &&
      localAddress.toLocaleLowerCase() === walletAddress.toLocaleLowerCase()
    ) {
      priKey = (await getStatesByKey('MAIN_PRIVATE_KEY')) as string;
      pubKey = (await getStatesByKey('MAIN_PUBLIC_KEY')) as string;
    }
    if (mainPublicKey && mainPrivateKey) {
      pubKey = mainPublicKey;
      priKey = mainPrivateKey;
    }

    if (!pubKey || !priKey) {
      throw new Error('main keys is required');
    }
    const payload = {
      mainPrivateKey: priKey,
      mainPublicKey: pubKey,
      password,
      didType: walletType,
      didValue: walletAddress,
      userid,
      pubkeyExpiredTimestamp: params.pubkeyExpiredTimestamp || 0,
    };
    const { tempPrivateKey, tempPublicKey, pubkeyExpiredTimestamp } =
      await this.login(payload);
    await saveStates('userid', userid);
    await saveStates('PRIVATE_KEY', tempPrivateKey);
    await saveStates('PUBLIC_KEY', tempPublicKey);
    await saveStates('WALLET_ADDRESS', walletAddress);
    await saveStates(`MAIN_PRIVATE_KEY`, priKey);
    await saveStates(`MAIN_PUBLIC_KEY`, pubKey);
    await saveStates(`DID_KEY`, `${walletType}:${walletAddress}`);
    await saveStates(
      'PUBKEY_EXPIRED_TIMESTAMP',
      String(pubkeyExpiredTimestamp),
    );
  }
}
