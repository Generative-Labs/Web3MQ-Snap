import * as jssha256 from 'js-sha256';
import * as ed from '@noble/ed25519';

import { EnvTypes } from './types';
import { domainUrlList } from './core/config';
import { getUserInfoRequest } from './api';
import { Request } from './core/request';
import { sha3_224 } from 'js-sha3';

export {
  userLoginRequest,
  getUserInfoRequest,
  getUserPublicProfileRequest,
  getPublicFollowerListRequest,
  getPublicFollowingListRequest,
} from './api';

export const ByteArrayToHexString = (
  byteArray: Iterable<unknown> | ArrayLike<unknown>,
) => {
  return Array.from(byteArray, (byte: any) =>
    // eslint-disable-next-line no-bitwise
    `0${(byte & 0xff).toString(16)}`.slice(-2),
  ).join('');
};

const Uint8ToBase64String = (u8a: any) => {
  return btoa(String.fromCharCode.apply(null, u8a));
};

export const GenerateEd25519KeyPair = async () => {
  const privateObj = ed.utils.randomPrivateKey();
  const pubkeyObj = await ed.getPublicKey(privateObj);
  const PrivateKey = ByteArrayToHexString(privateObj);
  const PublicKey = ByteArrayToHexString(pubkeyObj);
  return {
    PrivateKey,
    PublicKey,
  };
};

export const sha256 = (data: string | Uint8Array): Uint8Array => {
  return new Uint8Array(jssha256.sha256.digest(data));
};

export const getDataSignature = async (
  PrivateKey: string,
  signContent: string,
) => {
  if (!PrivateKey) {
    throw new Error('Ed25519PrivateKey not found');
  }
  const signature = await ed.sign(
    new TextEncoder().encode(signContent),
    PrivateKey,
  );
  return Uint8ToBase64String(signature);
};

export const getCurrentDate = () => {
  const d = new Date();
  return `${`0${d.getDate()}`.slice(-2)}/${`0${d.getMonth() + 1}`.slice(
    -2,
  )}/${d.getFullYear()} ${`0${d.getHours()}`.slice(
    -2,
  )}:${`0${d.getMinutes()}`.slice(-2)}`;
};

const getServerList = async (arr: any[]) => {
  let serverList = [];
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < arr.length; i++) {
    const domain = arr[i];
    try {
      const { data } = await Request.get(`${domain}/api/server-list/`);
      serverList = data;
      break;
    } catch (error) {

    }
  }
  return serverList;
};

export const getAllDomainList = async (env: EnvTypes) => {
  const list = await getServerList(domainUrlList[env]);

  const timestamp = Date.now();
  const requestQueue = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < list.length; i++) {
    const item = list[i].endpoint;
    try {
      const { headers } = await Request.head(`${item}/api/ping/`);
      const timeDifference = new Date(headers.date).valueOf() - timestamp;
      requestQueue.push({
        time: timeDifference,
        url: item,
        serverRate: headers['server-rate'],
        nodeId: headers.nodeid,
      });
    } catch (error) {
    }
  }
  return requestQueue;
};

const handleSort = (key: string) => {
  return (a: any, b: any) => {
    const val1 = Number(a[key]);
    const val2 = Number(b[key]);
    return val1 - val2;
  };
};

export const getFastestUrl = async (env: EnvTypes = 'test') => {
  const list = await getAllDomainList(env);
  return list.sort(handleSort('time'))[0].url;
};

export const renderMessagesList = async (msgList: any) => {
  return msgList.map((msg: any, idx: number) => {
    let content = '';
    if (msg.cipher_suite === 'NONE') {
      content = window.atob(msg.payload);
    } else {
      content = `UnKnow message type ${msg.cipher_suite}`;
    }
    const date = new Date(msg.timestamp);

    const timestampStr = `${date.getHours()}:${date.getMinutes()}`;

    const dateStr = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return {
      _id: idx + 1,
      id: idx + 1,
      indexId: idx + 1,
      content,
      senderId: msg.from,
      username: '',
      avatar: 'assets/imgs/doe.png',
      // date: "13 November",
      // timestamp: "10:20",
      date: dateStr,
      timestamp: timestampStr,
      system: false,
      saved: false,
      distributed: true,
      seen: true,
      failure: false,
    };
  });
};

export const transformAddress = async (
  walletAddress: string,
): Promise<string> => {
  if (walletAddress.toLowerCase().startsWith('0x')) {
    const { data } = await getUserInfoRequest({
      did_type: 'eth',
      did_value: walletAddress,
      timestamp: Date.now(),
    });
    return data.userid;
  }
  return walletAddress;
};

export const saveStates = async (keyName: string, value: any) => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
  if (state) {
    state[keyName] = value;
    return await snap.request({
      method: 'snap_manageState',
      params: { operation: 'update', newState: { ...state } },
    });
  }
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState: { [keyName]: value } },
  });
};

export const getStatesByKey = async (key: string) => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  if (state === null || typeof state !== 'object') {
    return null;
  }
  if (state[key]) {
    return state[key];
  }
  return null;
};

export const getWeb3MQTempKeys = async (showError = true) => {
  const privateKey = ((await getStatesByKey('PRIVATE_KEY')) as string) || '';
  const publicKey = ((await getStatesByKey('PUBLIC_KEY')) as string) || '';
  const pubkeyExpiredTimestamp = ((await getStatesByKey('PUBKEY_EXPIRED_TIMESTAMP')) as string) || '';
  const userid = ((await getStatesByKey('userid')) as string) || '';
  const walletAddress =
    ((await getStatesByKey('WALLET_ADDRESS')) as string) || '';
  const mainPrivateKey =
    ((await getStatesByKey('MAIN_PRIVATE_KEY')) as string) || '';
  const mainPublicKey =
    ((await getStatesByKey('MAIN_PUBLIC_KEY')) as string) || '';
  const didKey = ((await getStatesByKey('DID_KEY')) as string) || '';
  if (!privateKey && !publicKey && !userid && showError) {
    throw new Error('The PrivateKey and PublicKey is required!');
  }
  return {
    privateKey,
    publicKey,
    userid,
    walletAddress,
    mainPrivateKey,
    mainPublicKey,
    didKey,
    pubkeyExpiredTimestamp,
  };
};

export function newDateFormat(time: number, format?: string) {
  const t = new Date(time);
  format = format || 'Y-m-d h:i:s';
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();

  const hash = {
    y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  // 是否补 0
  const isAddZero = (o: string) => {
    return /M|D|H|I|S/.test(o);
  };
  return format.replace(/\w/g, (o) => {
    // @ts-ignore
    let rt = hash[o.toLocaleLowerCase()];
    if (typeof rt === 'string') return rt;
    return rt >= 10 || isAddZero(o) ? rt : `0${rt}`;
  });
}

export const GenerateMessageID = async (
  from: string,
  topic: string,
  timestamp: number,
  payload: Uint8Array,
) => {
  return sha3_224
    .update(from)
    .update(topic)
    .update(timestamp.toString())
    .update(payload)
    .hex();
};


