import { Message } from "../message";
import { PageParams } from "../types";

export type GetMessageListRpcDto = {
  option: PageParams
  topic: string
}

export async function getMessageList(payload: GetMessageListRpcDto) {
  try {
    const { option, topic } = payload;
    return await Message.getMessageList(option, topic);
  } catch (e) {
    throw new Error(e);
  }
}

export type SendMessageRpcDto = {
  msg: string
  topic: string
}
export async function sendMessage(payload: SendMessageRpcDto) {
  try {
    const { msg, topic } = payload;
    return await Message.sendMessage(msg, topic);
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
}
