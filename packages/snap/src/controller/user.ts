import { Client } from "../client";
import { getStatesByKey } from "../utils";
import { Message } from '../message';

export type ConnectRpcDto = {
  password: string
  nickname: string
}

export async function connectToWeb3MQ(payload: ConnectRpcDto) {
  try {
    const { password, nickname } = payload;
    await Client.init({ env: 'dev' });
    const url = (await getStatesByKey('FAST_URL')) || '';
    await Client.register.connectWeb3MQNetwork({
      password,
      nickname,
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

export type SearchUserRpcDto = {
  address: string
}
export async function searchUser(payload: SearchUserRpcDto) {
  try {
    const { address } = payload;
    return await Message.getTargetUserId(address);
  } catch (e: any) {
    throw new Error(e);
  }
}
