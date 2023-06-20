import { Request } from '../core/request';

import {
  CreateRoomApiParams,
  CommonGetListParams,
  GetMessageListParams,
  SearchParams,
  GetUserInfoParams,
  RegisterParams,
  LoginApiParams,
  GetUserPublicProfileParams,
  GetPublicFollowerListParams,
  RegisterApiResponse,
  FollowOperationApiParams,
  NewCommonGetListParams,
  SendFriendParams, SendMessageParams,
} from '../types';

export const createRoomRequest = async (payload: CreateRoomApiParams) => {
  return await Request.post(`/api/groups/`, payload);
};

export const getRoomListRequest = async (payload: CommonGetListParams) => {
  return await Request.get('/api/chats/', {
    params: payload,
  });
};

export const getMessageListRequest = async (payload: GetMessageListParams) => {
  return await Request.get('/api/messages/history/', {
    params: payload,
  });
};
export const searchUsersRequest = async (payload: SearchParams) => {
  return await Request.get('/api/users/search/', {
    params: payload,
  });
};
export const getNodeInfoRequest = async () => {
  return await Request.get('/api/nodeinfo/');
};

export const getUserInfoRequest = async (payload: GetUserInfoParams) => {
  return await Request.post('/api/get_user_info/', payload);
};

export const userRegisterRequest = async (
  payload: RegisterParams,
): Promise<RegisterApiResponse> => {
  return await Request.post('/api/user_register_v2/', payload);
};
export const sendMessageRequest = async (
  payload: SendMessageParams,
): Promise<any> => {
  return await Request.post('/api/send_message/', payload);
};

export const userLoginRequest = async (payload: LoginApiParams) => {
  return await Request.post('/api/user_login_v2/', payload);
};

export const getUserPublicProfileRequest = async (
  payload: GetUserPublicProfileParams,
) => {
  return await Request.get('/api/get_user_public_profile/', {
    params: payload,
  });
};

export const getPublicFollowerListRequest = async (
  payload: GetPublicFollowerListParams,
) => {
  return await Request.get('/api/user_public_followers/', {
    params: payload,
  });
};

export const getPublicFollowingListRequest = async (
  payload: GetPublicFollowerListParams,
) => {
  return await Request.get('/api/user_public_following/', {
    params: payload,
  });
};

export const followOperationRequest = async (
  payload: FollowOperationApiParams,
) => {
  return await Request.post('/api/following/', payload);
};

export const getContactListRequest = async (
  payload: NewCommonGetListParams,
) => {
  return await Request.get('/api/user_follow_contacts/', {
    params: payload,
  });
};

export const getFollowerListRequest = async (
  payload: NewCommonGetListParams,
) => {
  return await Request.get('/api/user_followers/', {
    params: payload,
  });
};

export const getFollowingListRequest = async (
  payload: NewCommonGetListParams,
) => {
  return await Request.get('/api/user_following/', {
    params: payload,
  });
};
export const getMyFriendListRequest = async (payload: CommonGetListParams) => {
  return await Request.get('/api/contacts/add_friends/', {
    params: payload,
  });
};
export const sendFriendRequest = async (payload: SendFriendParams) => {
  return await Request.post('/api/contacts/add_friends/', payload);
};
