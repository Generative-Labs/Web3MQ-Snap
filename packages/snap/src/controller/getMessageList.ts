import { Message } from "../message";
import { PageParams } from "../types";

export type GetMessageListRpcDto = {
  option: PageParams
  topic: string
}

export async function getMessageList(payload: GetMessageListRpcDto) {
  try {
    const { option, topic } = payload;
    console.log(payload, 'getMessageList payload');
    return await Message.getMessageList(option, topic);
  } catch (e) {
    throw new Error(e);
  }
}
