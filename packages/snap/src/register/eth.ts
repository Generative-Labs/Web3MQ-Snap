import { WalletSignRes } from '../types';

export const getEthAccount = async () => {
  let address = '';
  let reqParams = {
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }],
  };
  // @ts-ignore
  const requestPermissionsRes = await snap.request(reqParams).catch((e: any) => {
    console.log(e, 'err');
  });

  if (!requestPermissionsRes) {
    return { address };
  }

  try {
    console.log(ethereum, 'ethereum');
    //@ts-ignore
    let addresses = await ethereum.request({
      //@ts-ignore
      method: 'eth_accounts',
    });
    console.log(addresses, 'addresses');
    //@ts-ignore
    if (addresses && addresses.length > 0) {
      //@ts-ignore
      address = addresses[0];
    }
  } catch (err) {
    console.log(err);
  }
  return { address };
};

export const signWithEth = async (
  signContent: string,
  didValue: string,
): Promise<WalletSignRes> => {
  const sign = await ethereum.request({
    method: 'personal_sign',
    params: [signContent, didValue, 'web3mq'],
  });
  return {
    sign: sign as string,
  };
};
