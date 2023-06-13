import { Client } from "../client";
import { getStatesByKey } from "../utils";

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
