import { Client } from '../client';
import {
  DefaultEnv,
  getStatesByKey,
} from '../utils';
import { Message } from '../message';
import {
  ConnectToWeb3MQParams,
  RegisterToWeb3MQParams,
  WalletType,
} from '../types';

export type ConnectRpcDto = {
  password: string;
  nickname?: string;
  address: string;
};

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

export async function getRegisterSignContent(payload: {
  userid: string;
  mainPublicKey: string;
  didType?: WalletType;
  didValue: string;
}) {
  try {
    if (!Client.register) {
      await Client.init({ env: DefaultEnv });
    }
    const { userid, mainPublicKey, didValue, didType = 'eth' } = payload;
    return await Client.register.getRegisterSignContent({
      userid,
      mainPublicKey,
      didType,
      didValue,
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function exportWeb3MQKeys() {
  const privateKey =
    ((await getStatesByKey('MAIN_PRIVATE_KEY')) as string) || '';
  const publicKey = ((await getStatesByKey('MAIN_PUBLIC_KEY')) as string) || '';
  const address = ((await getStatesByKey('WALLET_ADDRESS')) as string) || '';
  return {
    privateKey,
    publicKey,
    address,
  };
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
