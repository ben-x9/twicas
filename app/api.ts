import * as xhr from 'xhr';
import { map, snakeCase, camelCase, mapKeys, mapValues } from 'lodash';
import { User } from 'store/user';
import { Comment } from 'store/comment';

const baseUrl = 'https://v20ki0pxd7.execute-api.us-west-2.amazonaws.com/supercast/';

const unproxiedBaseUrl = 'https://apiv2.twitcasting.tv/';

const clientId = 'i3233014286.94718e949c391fb9609da6976d691d2f5e650b9d478118927bea896b7c695ebc';
const clientSecret = require('../twicas-secret.json');

const redirectUri = 'http://localhost:8080/twit_auth';

interface Global extends Window {
  accessToken: string;
}
const global = window as Global;

type Data = {[key: string]: primitive};

type Callback<T> = (error: Error|null, data: T) => void;

const queryString = (vals: Data) =>
  map(vals, (val, param) => `${snakeCase(param)}=${val}`).join('&');

const camelizeKeys = (object: ByKey<any>) =>
  mapKeys(object, (value, key) => camelCase(key));

const camelizeKeysDeep = (data: any): any =>
  Array.isArray(data) ?
    data.map(camelizeKeysDeep) :
  typeof data === 'object' ?
    mapValues(camelizeKeys(data), (value) => camelizeKeysDeep(value)) :
  data;

const url = (path: string, queryVals?: {[param: string]: string}) =>
  baseUrl + path + (queryVals ? ('?' + queryString(queryVals)) : '');

const authUrl = unproxiedBaseUrl + 'oauth2/authorize?' + queryString({
  clientId,
  responseType: 'code',
});

export const fetchAccessToken = (code: string, callback: () => void) => {
  debugger
  post('oauth2/access_token', {
    code,
    grantType: 'authorization_code',
    clientId,
    clientSecret,
    redirectUri,
  }, (err, data) => {
    const token = data['accessToken'] as string;
    global.accessToken = token;
    localStorage.setItem('accessToken', token);
    callback();
  });
};

const post = (uri: string, args: Data, callback: Callback<any>) =>
  xhr.post({
    url: url(uri),
    headers: {'Content-type': 'application/x-www-form-urlencoded'},
    body: queryString(args),
    responseType: 'json',
  }, (err, resp) => callback(err, camelizeKeysDeep(resp.body)));

const get = (uri: string, args: Data, callback: Callback<any>) => {
  if (!global.accessToken) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      global.accessToken = token;
    } else {
      localStorage.setItem('returnToPath', location.pathname);
      window.location.replace(authUrl);
      return;
    }
  }
  const query = queryString(args);
  xhr.get({
    url: url(uri) + (query ? '?' + query : ''),
    headers: {
      'Accept': 'application/json',
      'X-Api-Version': '2.0',
      'Authorization': `Bearer ${global.accessToken}`,
    },
    responseType: 'json',
   }, (err, resp) => {
     if (err) throw err;
     callback(err, camelizeKeysDeep(resp.body));
   });
};

export function getUser(id: string, callback: Callback<User>) {
  get(`users/${id}`, {}, (err: Error, data: any) =>
    data.error ?
      callback(new Error('no such user'), data) :
      callback(null, data.user));
}

export function getComments(movieId: string, callback: Callback<ReadonlyArray<Comment>>) {
  get(`movies/${movieId}/comments?offset=0&limit=10`, {},
    (err: Error, data: any) => !err && callback(null, data.comments),
  );
}

export function getCurrentLiveId(userId: string, callback: Callback<string>) {
  get(`users/${userId}/current_live`, {}, (err: Error, data: any) =>
    data.error ?
      callback(new Error('that user is not live'), '') :
      callback(null, data.movie.id));
}

export function getCurrentUser(callback: Callback<User>) {
  get(`verify_credentials`, {}, (err: Error, data: any) =>
    callback(err, data.user as User));
}