import { sendNotifyMessage } from '../controller/notifyMessage';
import { connectToWeb3MQ, searchUser } from '../controller/user';
import { SnapRouter } from '../lib/Router';
import { createRoom, getChannelList } from '../controller/channel';
import { getMessageList, sendMessage } from '../controller/chat';
import {
  followOperation,
  getContactList,
  getFollowerList,
  getFollowingList,
  getMyFriendRequestList,
  requestFollow,
} from '../controller/contacts';

const router = new SnapRouter();

router
  .use('connectToWeb3MQ', connectToWeb3MQ)
  .use('creatRoom', createRoom)
  .use('getChannelList', getChannelList)
  .use('sendNotifyMessage', sendNotifyMessage)
  .use('sendMessage', sendMessage)
  .use('searchUser', searchUser)
  .use('getContactList', getContactList)
  .use('getFollowerList', getFollowerList)
  .use('getFollowingList', getFollowingList)
  .use('requestFollow', requestFollow)
  .use('followOperation', followOperation)
  .use('getMyFriendRequestList', getMyFriendRequestList)
  .use('getMessageList', getMessageList);

export default router;
