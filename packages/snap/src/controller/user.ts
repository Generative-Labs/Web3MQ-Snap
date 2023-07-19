import { Client } from '../client';
import {
  DefaultEnv,
  getStatesByKey, getWeb3MQTempKeys, saveStates,
} from '../utils';
import { Message } from '../message';
import {
  ConnectToWeb3MQParams, GetRegisterSignContentParams,
  RegisterToWeb3MQParams,
  WalletType,
} from '../types';

export async function checkUserExist(payload: { address: string }) {
  try {
    const { address } = payload;
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    return await Client.register.getUserInfo({
      did_type: 'eth',
      did_value: address,
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getMainKeySignContent(payload: {
  password: string;
  address: string;
  walletType?: WalletType;
}) {
  try {
    const { password, address, walletType = 'eth' } = payload;

    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    return await Client.register.getMainKeypairSignContent({
      password,
      did_type: walletType,
      did_value: address,
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getMainKeypairBySignature(payload: {
  password: string;
  signature: string;
}) {
  try {
    const { password, signature } = payload;
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    return await Client.register.getMainKeypairBySignature(signature, password);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getRegisterSignContent(payload: GetRegisterSignContentParams) {
  try {
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    return await Client.register.getRegisterSignContent(payload);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function exportWeb3MQKeys() {
  const privateKey = ((await getStatesByKey('PRIVATE_KEY')) as string) || '';
  const publicKey = ((await getStatesByKey('PUBLIC_KEY')) as string) || '';
  const pubkeyExpiredTimestamp = ((await getStatesByKey('PUBKEY_EXPIRED_TIMESTAMP')) as string) || '';
  const userid = ((await getStatesByKey('userid')) as string) || '';
  const walletAddress =
    ((await getStatesByKey('WALLET_ADDRESS')) as string) || '';
  const mainPrivateKey =
    ((await getStatesByKey('MAIN_PRIVATE_KEY')) as string) || '';
  const mainPublicKey =
    ((await getStatesByKey('MAIN_PUBLIC_KEY')) as string) || '';
  const didKey = ((await getStatesByKey('DID_KEY')) as string) || '';
  return {
    privateKey,
    publicKey,
    userid,
    walletAddress,
    mainPrivateKey,
    mainPublicKey,
    didKey,
    pubkeyExpiredTimestamp,
  };
  return await getWeb3MQTempKeys()
}

export async function disconnect() {
  await saveStates('PRIVATE_KEY', '')
  await saveStates('PUBLIC_KEY', '')
  await saveStates('userid', '')
  await saveStates('PUBKEY_EXPIRED_TIMESTAMP', '')
}


export async function clearWeb3MQKeys() {
  await saveStates('PRIVATE_KEY', '')
  await saveStates('PUBLIC_KEY', '')
  await saveStates('userid', '')
  await saveStates('WALLET_ADDRESS', '')
  await saveStates('MAIN_PRIVATE_KEY', '')
  await saveStates('MAIN_PUBLIC_KEY', '')
  await saveStates('DID_KEY', '')
  await saveStates('PUBKEY_EXPIRED_TIMESTAMP', '')
}

export async function registerToWeb3MQNetwork(payload: RegisterToWeb3MQParams) {
  try {
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    await Client.register.registerToWeb3MQNetwork(payload);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function connectToWeb3MQ(payload: ConnectToWeb3MQParams) {
  try {
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    await Client.register.connectWeb3MQNetwork(payload);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function connectWeb3MQNetwork_v1(payload: ConnectToWeb3MQParams) {
  try {
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    await Client.register.connectWeb3MQNetwork_v1(payload);
  } catch (e: any) {
    throw new Error(e);
  }
}

export type SearchUserRpcDto = {
  address: string;
};

export async function searchUser(payload: SearchUserRpcDto) {
  try {
    const { address } = payload;
    return await Message.getTargetUserId(address);
  } catch (e: any) {
    throw new Error(e);
  }
}
