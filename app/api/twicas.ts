import * as xhr from 'xhr';
import { map, snakeCase, camelCase, mapKeys, mapValues } from 'lodash';
import { User } from 'store/user';
import { Comment } from 'store/comment';
import { Callback, ActionCallback, action } from 'core/api';

const baseUrl = 'https://v20ki0pxd7.execute-api.us-west-2.amazonaws.com/supercast/';

const unproxiedBaseUrl = 'https://apiv2.twitcasting.tv/';

const clientId = 'i3233014286.a592ee8f5c9f84396e7a22f67de7fcfcdcdedc344d9f5ddd0b2b60ea3a9b577b';
const clientSecret = require('../../twicas-secret.json');

const redirectUri = 'https://twicas-17f39.firebaseapp.com/twicas_auth';

interface Global extends Window {
  accessToken: string;
}
const global = window as Global;

type Data = {[key: string]: primitive};


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
  post('oauth2/access_token', {
    code,
    grantType: 'authorization_code',
    clientId,
    clientSecret,
    redirectUri,
  }, (err, data) => {
    const token = data['accessToken'] as string;
    localStorage.setItem('accessToken', token);
    global.accessToken = token;
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

export function getUser(id: string, callback: ActionCallback<User>) {
  get(`users/${id}`, {}, (err: Error, data: any) =>
    data.error ?
      action(callback, new Error('no such user'), data) :
      action(callback, null, data.user));
}

export function getComments(movieId: string, callback: ActionCallback<ReadonlyArray<Comment>>) {
  get(`movies/${movieId}/comments?offset=0&limit=10`, {},
    (err: Error, data: any) => !err && action(callback, null, data.comments),
  );
}

export function getCurrentLiveId(userId: string, callback: ActionCallback<string>) {
  get(`users/${userId}/current_live`, {}, (err: Error, data: any) =>
    data.error ?
      action(callback, new Error('this user is not live'), '') :
      action(callback, null, data.movie.id));
}

export function getCurrentUser(callback: ActionCallback<User>) {
  get(`verify_credentials`, {}, (err: Error, data: any) =>
    action(callback, err, data.user as User));
}