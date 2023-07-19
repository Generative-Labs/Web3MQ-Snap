import {
  getDataSignature,
  getStatesByKey,
  getWeb3MQTempKeys,
  newDateFormat,
  saveStates,
} from '../utils';
import { pullNewMessages } from '../api';
import { sendNotifyMessage } from '../controller/notifyMessage';

export const fetchNewMessages = async () => {
  const { privateKey, userid } = await getWeb3MQTempKeys();
  const timestamp = Date.now();
  const syncTime =
    ((await getStatesByKey('pull_sync_timestamp')) as number) || Date.now();
  console.log(newDateFormat(syncTime, 'Y/m/d h:i'), 'sync_time');
  const signContent = userid + syncTime + timestamp;
  const web3mq_user_signature = await getDataSignature(privateKey, signContent);
  try {
    const {
      data: { latest_timestamp, messages, notifications },
    } = await pullNewMessages({
      web3mq_user_signature,
      userid,
      timestamp,
      sync_timestamp: syncTime,
    });
    if (latest_timestamp > 0) {
      await saveStates('pull_sync_timestamp', latest_timestamp + 1);
    } else {
      await saveStates('pull_sync_timestamp', syncTime);
    }
    let notifyMessage = '';
    if (messages) {
      if (messages.group && messages.group > 0) {
        const str = messages.group === 1 ? 'message' : 'messages';
        notifyMessage = `You have received ${messages.group} new group chat ${str}.`;
      }
      if (messages.single && messages.single > 0) {
        const str = messages.single === 1 ? 'message' : 'messages';
        notifyMessage = `You have received ${messages.single} new private ${str}.`;
      }
    }
    if (notifications && Object.keys(notifications).length > 0) {
      for (const notificationKey in notifications) {
        const num = notifications[notificationKey];
        if (notificationKey === 'system.friend_request') {
          const str = num === 1 ? 'request' : 'requests';
          notifyMessage = `You have received ${num} new friend ${str}.`;
        } else if (notificationKey === 'system.followed') {
          const str = num === 1 ? 'user is' : 'users are';
          notifyMessage = `${num} new ${str} following you.`;
        } else {
          const str = num === 1 ? 'notification' : 'notifications';
          notifyMessage = `You have received ${num} new ${str}.`;
        }
      }
    }
    if (notifyMessage) {
      console.log(notifyMessage);
      await sendNotifyMessage({
        message: notifyMessage,
      });
    }
  } catch (e) {
    console.log(e);
    await saveStates('pull_sync_timestamp', syncTime);
  }
};
