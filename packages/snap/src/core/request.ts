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
  const Url = body
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}${endpoint}?${qs.stringify(customConfig, { encode: true })}`;

  return fetch(`${Url}`, config).then(async (response) => {
    if (response.status === 401) {
      return;
    }

    if (response.status === 200) {
      const res = await response.json();
      console.log(res, 'fetch resp')
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      // const { data } = res;
      // eslint-disable-next-line consistent-return
      return res;
    }
    console.log(response, 'fetch error')
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
