import { Action as CoreAction } from 'core/actions';
import * as api from 'api';
import { Store, State } from 'root';
import { set, stop } from 'core/common';

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

export function perform(action: Action, store: Store, state: State, callback: (store: Store, state: State, action: Action|null) => void) {
  switch (action.type) {
    case 'GET_CURRENT_USER':
      api.getCurrentUser((err, user) =>
        callback(set(store, {user}), state, null));
      break;
    case 'SUBSCRIBE_COMMENTS':
      if (timerId !== null) clearInterval(timerId);
      api.getUser(action.userId, (err, user) =>
        stop(!err && callback(set(store, {user}), state, null)));
      api.getCurrentLiveId(action.userId, (err, liveId) => {
        if (err) return;
        const getComments = () => api.getComments(liveId, (err, comments) =>
          callback(set(store, {comments}), state, null));
        getComments();
        // timerId = setInterval(() => getComments(), 3000);
      });
      break;
    case 'UNSUBSCRIBE_COMMENTS':
      if (timerId !== null) clearInterval(timerId);
      break;
  }
};

