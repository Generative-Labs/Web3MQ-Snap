import { Register } from '../register';
import { Request } from '../core/request';
import { EnvTypes } from '../types';

import { getFastestUrl, getStatesByKey, saveStates } from '../utils';

export class Client {
  static register: Register;

  static init = async (initOptions: { env: EnvTypes }) => {
    const { env = 'test' } = initOptions;
    const app_key: string = 'vAUJTFXbBZRkEDRE';
    const fastUrl = (await getFastestUrl(env)) || '';
    await saveStates('FAST_URL', fastUrl);
    Client.register = new Register(app_key);
    return fastUrl;
  };
}
