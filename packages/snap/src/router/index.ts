import { sendNotifyMessage } from '../controller/notifyMessage';
import {
  checkUserExist,
  clearWeb3MQKeys,
  connectToWeb3MQ,
  disconnect,
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
  getFollowingList,
  getFollowSignContent,
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
  .use('exportWeb3MQKeys', exportWeb3MQKeys)
  .use('disconnect', disconnect)
  .use('clearWeb3MQKeys', clearWeb3MQKeys)
  .use('getFollowSignContent', getFollowSignContent)
  .use('getMessageList', getMessageList);

export default router;
