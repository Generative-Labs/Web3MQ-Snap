import { Client } from '../client';
import {
  DefaultEnv,
  getStatesByKey, getWeb3MQTempKeys,
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
  return await getWeb3MQTempKeys()
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
