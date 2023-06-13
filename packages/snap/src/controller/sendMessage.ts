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
    } catch (error) {
      // @ts-ignore
      throw new Error(error);
    }
}
