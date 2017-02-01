import { Action as CoreAction } from 'core/actions';
import * as api from 'api';
import { Store, State } from 'root';
import { set, stop } from 'core/common';
import * as Root from 'root';

export interface GetCurrentUser {
  type: 'GET_CURRENT_USER';
}

export interface SubscribeComments {
  type: 'SUBSCRIBE_COMMENTS';
  userId: string;
}

export interface UnsubscribeComments {
  type: 'UNSUBSCRIBE_COMMENTS';
  userId: string;
}

export type Action = CoreAction | GetCurrentUser | SubscribeComments | UnsubscribeComments;

let timerId: number | null = null;

interface Global extends Window {
  // read the global store and state in callbacks to stay up to date
  store: Root.Store;
  state: Root.State;
}
const global = window as Global;

export function perform(action: Action, store: Store, state: State, callback: (store: Store, state: State, action: Action|null) => void) {
  switch (action.type) {
    case 'GET_CURRENT_USER':
      api.getCurrentUser((err, user) =>
        callback(set(store, {user}), state, null));
      break;
    case 'SUBSCRIBE_COMMENTS':
      if (timerId !== null) clearInterval(timerId);
      api.getUser(action.userId, (err, user) =>
        !err && callback(set(global.store, {user}), state, null));
      api.getCurrentLiveId(action.userId, (err, liveId) => {
        if (err) { debugger };
        const getComments = () => api.getComments(liveId, (err, comments) =>
          callback(set(global.store, {comments}), state, null));
        getComments();
        // timerId = setInterval(() => getComments(), 3000);
      });
      break;
    case 'UNSUBSCRIBE_COMMENTS':
      if (timerId !== null) clearInterval(timerId);
      break;
  }
};

