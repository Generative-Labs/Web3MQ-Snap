import {
  ContactListItemType,
  FollowOperationParams, GetFollowSignContentParams,
  PageParams,
} from '../types';
import { Contact } from '../contact';

export const getContactList = async (
  payload: PageParams,
): Promise<ContactListItemType[]> => {
  try {
    return await Contact.getContactList(payload);
  } catch (e) {
    throw new Error(e);
  }
};
export const getFollowerList = async (
  payload: PageParams,
): Promise<ContactListItemType[]> => {
  try {
    return await Contact.getFollowerList(payload);
  } catch (e) {
    throw new Error(e);
  }
};
export const getFollowingList = async (
  payload: PageParams,
): Promise<ContactListItemType[]> => {
  try {
    return await Contact.getFollowingList(payload);
  } catch (e) {
    throw new Error(e);
  }
};

export type RequestFollowRpcDto = {
  targetId: string;
  content?: string;
};
export const requestFollow = async (payload: RequestFollowRpcDto) => {
  try {
    const { targetId, content = '' } = payload;
    return await Contact.sendFriend(targetId, content);
  } catch (e) {
    throw new Error(e);
  }
};
export const getFollowSignContent = async (payload: GetFollowSignContentParams) => {
  try {
    return await Contact.getFollowSignContent(payload);
  } catch (e) {
    throw new Error(e);
  }
};
export const followOperation = async (payload: FollowOperationParams) => {
  try {
    return await Contact.followOperation(payload);
  } catch (e) {
    throw new Error(e);
  }
};
export const getMyFriendRequestList = async (payload: PageParams) => {
  try {
    return await Contact.getMyFriendRequestList(payload);
  } catch (e) {
    throw new Error(e);
  }
};
