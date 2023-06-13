import { sendNotifyMessage } from '../controller/notifyMessage';
import { connectToWeb3MQ } from '../controller/connectToWeb3MQ';
import { SnapRouter, SnapRpcPayload, SnapRpcRequest } from '../lib/Router';
import { createRoom } from '../controller/createRoom';
import { getChannelList } from '../controller/getChannelList';
import { sendMessage } from '../controller/sendMessage';
import { getMessageList } from '../controller/getMessageList';

const router = new SnapRouter();

router
  .use('connectToWeb3MQ', connectToWeb3MQ)
  .use('creatRoom', createRoom)
  .use('getChannelList', getChannelList)
  .use('sendNotifyMessage', sendNotifyMessage)
  .use('sendMessage', sendMessage)
  .use('getMessageList', getMessageList)


export default router


