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

export type GetRegisterSignContentResponse = {
  signContent: string;
  registerTime: number
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

export type ServiceResponse = {
  data: any;
  msg: string;
  code: number;
};
export type WalletBaseParams = {
  userid: string;
  did_pubkey?: string;
  did_signature: string;
  sign_content: string;
  timestamp: number;
};
export interface FollowOperationApiParams extends WalletBaseParams {
  address: string;
  target_userid: string;
  action: 'follow' | 'cancel';
  did_type: WalletType;
}
export type NewBaseParams = {
  userid: string;
  web3mq_user_signature: string;
  timestamp: number;
};

export interface SendMessageParams extends NewBaseParams{
  nodeid: string
  payload_type: string
  payload: string
  need_store: boolean
  cipher_suite: string
  content_topic: string
  messageid: string
}

export interface NewCommonGetListParams extends NewBaseParams, PageParams {}

export interface SendFriendParams extends BaseParams {
  content: string;
  target_userid: string;
}
export type FollowStatus = 'following' | 'follower' | 'follow_each';
export type UserPermissionsType = Record<string, { type: string; value: boolean }>;

export type ContactListItemType = {
  avatar_url: string;
  follow_status: FollowStatus;
  nickname: string;
  permissions: UserPermissionsType;
  userid: string;
  wallet_address: string;
  wallet_type: WalletType;
};

export interface FollowOperationParams {
  address: string;
  targetUserid: string;
  action: 'follow' | 'cancel';
  didType: WalletType;
}

export type ConnectToWeb3MQParams =  {
  mainPrivateKey?: string; // in snap state || register
  mainPublicKey?: string; // in snap state  || register
  walletType?: WalletType;
  walletAddress: string;
  password: string;
  pubkeyExpiredTimestamp?: number;
  userid?: string
}
export type RegisterToWeb3MQParams =  {
  mainPrivateKey: string; // in snap state || register
  mainPublicKey: string; // in snap state  || register
  walletType?: WalletType;
  walletAddress: string;
  password: string;
  signature: string; // require by register
  didPubkey?: string; // require by starknet
  registerSignContent: string; // require by register
  registerTime: number; // require by register
  nickname?: string;
  avatarUrl?: string;
  userid: string;
}
