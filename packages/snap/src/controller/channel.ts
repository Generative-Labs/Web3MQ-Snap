import { Channel } from "../channel";

export type CreateRoomDto = {
  group_name?: string
}

export async function createRoom(payload: CreateRoomDto) {
  try {
    const { group_name = '' } = payload;
    const res = await Channel.createRoom(group_name, '');
    console.log(res, 'channel response')
    return res
  } catch (e) {
    throw new Error(e);
  }
}

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
