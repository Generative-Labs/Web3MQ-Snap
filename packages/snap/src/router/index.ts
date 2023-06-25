import { sendNotifyMessage } from '../controller/notifyMessage';
import {
  checkUserExist,
  connectToWeb3MQ,
  connectWeb3MQNetwork_v1,
  exportWeb3MQKeys,
  getMainKeypairBySignature,
  getMainKeySignContent,
  getRegisterSignContent,
  registerToWeb3MQNetwork,
  searchUser,
} from '../controller/user';
import { SnapRouter } from '../lib/Router';
import { createRoom, getChannelList } from '../controller/channel';
import { getMessageList, sendMessage } from '../controller/chat';
import {
  followOperation,
  getContactList,
  getFollowerList,
  getFollowingList, getFollowSignContent,
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
  .use('checkUserExist', checkUserExist)
  .use('getMainKeySignContent', getMainKeySignContent)
  .use('getMainKeypairBySignature', getMainKeypairBySignature)
  .use('registerToWeb3MQNetwork', registerToWeb3MQNetwork)
  .use('getRegisterSignContent', getRegisterSignContent)
  .use('getMyFriendRequestList', getMyFriendRequestList)
  .use('exportWeb3MQKeys', exportWeb3MQKeys)
  .use('connectWeb3MQNetwork_v1', connectWeb3MQNetwork_v1)
  .use('getFollowSignContent', getFollowSignContent)
  .use('getMessageList', getMessageList);

export default router;
