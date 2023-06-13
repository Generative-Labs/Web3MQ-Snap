import { Channel } from "../channel";

export type GetChannelListRpcDto = {
  options: {
    page: number,
    size: number,
  },
}

export async function getChannelList(payload: GetChannelListRpcDto) {
  try {
    const { options } = payload;
    console.log(options, 'options');
    return await Channel.queryChannels(options);
  } catch (e) {
    throw new Error(e);
  }
}
