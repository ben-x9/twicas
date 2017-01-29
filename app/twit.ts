import * as xhr from 'xhr';
import { map, snakeCase, camelCase, mapKeys, mapValues } from 'lodash';

const baseUrl = 'https://v20ki0pxd7.execute-api.us-west-2.amazonaws.com/supercast/';

const clientId = 'i3233014286.94718e949c391fb9609da6976d691d2f5e650b9d478118927bea896b7c695ebc';
const clientSecret = require('../twicas-secret.json');

const redirectUri = 'http://localhost:8080/twit_auth';

interface Global extends Window {
  accessToken: string;
}
const global = window as Global;

type Data = {[key: string]: primitive};

type Callback = (error: Error, data: any) => void;

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

export const authUrl = url('oauth2/authorize', {
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
    setAccessToken(data['accessToken'] as string);
    callback();
  });
};

function setAccessToken(token: string) {
  global.accessToken = token;
  localStorage.setItem('accessToken', token);
}

export function loadAccessToken(callback: () => void) {
  const token = localStorage.getItem('accessToken');
  if (token) {
    global.accessToken = token;
    return false;
  }
  callback();
  return true;
}

const post = (uri: string, args: Data, callback: Callback) =>
  xhr.post({
    url: url(uri),
    headers: {'Content-type': 'application/x-www-form-urlencoded'},
    body: queryString(args),
    responseType: 'json',
  }, (err, resp) => callback(err, camelizeKeysDeep(resp.body)));

const get = (uri: string, args: Data, callback: Callback) => {
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

export function getUserData(id: string, callback: Callback) {
  get(`users/${id}`, {}, callback);
}

export function getComments(id: string, callback: Callback) {
  get(`movies/${id}/comments?offset=0&limit=10`, {}, callback);
}

export function getCurrentLive(id: string, callback: Callback) {
  get(`users/${id}/current_live`, {}, callback);
}