export type PageParams = {
  page?: number;
  size?: number;
};

export type AccountType = {
  address: string;
};

export type RegisterBySignParams = {
  userid: string;
  didValue: string;
  mainPublicKey: string;
  signature: string;
  did_pubkey?: string;
  didType?: WalletType;
  signContentURI?: string;
  nickname?: string;
  avatar_url?: string;
  avatar_base64?: string;
};

export type LoginByKeysParams = {
  mainPrivateKey: string;
  mainPublicKey: string;
  didType: WalletType;
  didValue: string;
  userid: string;
  password: string;
  pubkeyExpiredTimestamp?: number;
};

export type GetUserInfoParams = {
  did_type: string;
  did_value: string;
  timestamp: number;
};

export type GetUserInfoResponse = { userid: string; userExist: boolean };

export type GetMainKeypairParams = {
  password: string;
  did_type: WalletType;
  did_value: string;
};

export type EnvTypes = 'dev' | 'test';

export type RegisterParams = {
  userid: string;
  did_type: string;
  did_value: string;
  did_signature: string;
  pubkey_type: string;
  pubkey_value: string;
  signature_content: string;
  timestamp: number;
  nickname?: string;
  avatar_base64?: string;
  avatar_url?: string;
  testnet_access_key?: string;
  did_pubkey?: string;
};

export type RegisterApiResponse = {
  did_type: string;
  did_value: string;
  userid: string;
};

export type LoginResponse = {
  tempPrivateKey: string;
  tempPublicKey: string;
  mainPrivateKey: string;
  mainPublicKey: string;
  pubkeyExpiredTimestamp: number;
};

export type LoginApiParams = {
  userid: string;
  did_type: string;
  did_value: string;
  login_signature: string;
  signature_content: string;
  main_pubkey: string;
  pubkey_value: string;
  pubkey_type: string;
  timestamp: number;
  pubkey_expired_timestamp: number;
};

export type BaseParams = {
  userid: string;
  web3mq_signature: string;
  timestamp: number;
};

export type GroupPermissions = {
  [key: string]: {
    type: string;
    value: 'ceator_invite_friends' | 'public' | 'nft_validation';
  };
};

export interface CreateRoomApiParams extends BaseParams {
  group_name?: string;
  groupid?: string;
  avatar_url?: string;
  avatar_base64?: string;
  permissions?: GroupPermissions;
}

export interface CommonGetListParams extends BaseParams, PageParams {}

export interface GetMessageListParams extends BaseParams, PageParams {
  topic: string;
}

export interface SearchParams extends BaseParams {
  keyword: string;
}

export interface GetUserPublicProfileParams {
  did_type: string;
  did_value: string;
  timestamp: number;
  my_userid: string;
}

export interface GetPublicFollowerListParams extends PageParams {
  userid: string;
  timestamp: number;
}

export type WalletType = 'eth' | 'starknet' | 'qrcode';

export type WalletSignRes = {
  sign: string;
  publicKey?: string;
};

export type GetSignContentResponse = {
  signContent: string;
};

export type GetRegisterSignContentParams = {
  userid: string;
  mainPublicKey: string;
  didType: WalletType;
  didValue: string;
  signContentURI?: string;
};

export type MainKeypairType = {
  publicKey: string;
  secretKey: string;
};

export const WalletNameMap = {
  eth: 'Ethereum',
  starknet: 'Argent X',
  qrcode: 'Qrcode',
};
