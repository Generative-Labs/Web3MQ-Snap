import { Register } from '../register';
import { Request } from '../core/request';
import { EnvTypes } from '../types';

import { getFastestUrl, getStatesByKey, saveStates } from '../utils';

export class Client {
  static register: Register;
  static init = async (initOptions: { env: EnvTypes }) => {
    const { env } = initOptions;
    const app_key: string = 'vAUJTFXbBZRkEDRE';
    const localUrl = ((await getStatesByKey('FAST_URL')) as string) || '';
    const fastUrl = (localUrl as string) || (await getFastestUrl(env)) || '';
    await saveStates('FAST_URL', fastUrl);
    new Request();
    Client.register = new Register(app_key);
    return fastUrl;
  };
}
