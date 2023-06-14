import { Channel } from "../channel";

export type CreateRoomDto = {
  group_name?: string
}

export async function createRoom(payload: CreateRoomDto) {
  try {
    const { group_name = '' } = payload;
    const res = await Channel.createRoom(group_name, '');
    console.log(res, 'createRoom response')
    return res
  } catch (e) {
    throw new Error(e);
  }
}
