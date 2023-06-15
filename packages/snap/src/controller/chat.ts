import { Message } from "../message";
import { PageParams } from "../types";

export type GetMessageListRpcDto = {
  option: PageParams
  topic: string
}

export async function getMessageList(payload: GetMessageListRpcDto) {
  try {
    const { option, topic } = payload;
    console.log(payload, 'chat payload');
    return await Message.getMessageList(option, topic);
  } catch (e) {
    throw new Error(e);
  }
}

export type SendMessageRpcDto = {
  msg: string
  topic: string
}

/**
 * sdk里是ws实现的，暂时不知道咋弄了
 * @param payload
 */
export async function sendMessage(payload: SendMessageRpcDto) {
  try {
    const { msg, topic } = payload;
    // @ts-ignore
    // return await wallet.client.message.sendMessage(msg, topic);
    return msg
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}
