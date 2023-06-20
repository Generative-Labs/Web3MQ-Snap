import { Channel } from '../channel';

export type CreateRoomDto = {
  group_name?: string;
};

export async function createRoom(payload: CreateRoomDto) {
  try {
    const { group_name = '' } = payload;
    return await Channel.createRoom(group_name, '');
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
    return await Channel.queryChannels(options);
  } catch (e) {
    throw new Error(e);
  }
}
