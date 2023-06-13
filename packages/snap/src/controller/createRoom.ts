import { Channel } from "../channel";

export type NotifyMessageRpcDto = {
  message: string
}

export async function createRoom(payload: any) {
  try {
    const { group_name = '', avatar_url = '' } = payload;
    const res = await Channel.createRoom(group_name, avatar_url);
    console.log(res, 'createRoom response')
    return res
  } catch (e) {
    throw new Error(e);
  }
}
