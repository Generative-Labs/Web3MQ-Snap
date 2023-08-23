import qs from 'query-string';
import { getStatesByKey } from '../utils';

export const request = async (
  endpoint: string,
  { body, ...customConfig }: any = {},
) => {
  const baseUrl = (await getStatesByKey('FAST_URL')) || '';
  const didKey = (await getStatesByKey('DID_KEY')) || '';
  const pubKey = (await getStatesByKey('PUBLIC_KEY')) || '';
  const headers = {
    'content-type': 'application/json',
    'web3mq-request-pubkey': pubKey,
    didKey: didKey,
  };
  const config = {
    method: body ? 'POST' : 'GET',
    mode: 'cors',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  let Url = body
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}${endpoint}?${qs.stringify(customConfig, { encode: true })}`;
  if (endpoint.indexOf('https://') !== -1) {
    Url = body
      ? endpoint
      : `${endpoint}?${qs.stringify(customConfig, { encode: true })}`;
  }

  return fetch(`${Url}`, config).then(async (response) => {
    if (response.status === 401) {
      return;
    }

    if (response.status === 200) {
      const res = await response.json();
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      return res;
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  });
};

export class Request {
  static post(endpoint: string, customConfig = {}) {
    return request(endpoint, { body: customConfig });
  }

  static get(endpoint: string, customConfig: any = {}) {
    return request(endpoint, { ...customConfig.params });
  }

  static head(endpoint: string) {
    return fetch(endpoint, { method: 'HEAD' }).then((res) => {
      const headers: any = {};
      res.headers.forEach((v, k) => (headers[k] = v));
      return { headers };
    });
  }
}
