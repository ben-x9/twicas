import { Action as CoreAction } from 'core/actions';
import * as api from 'api';
import { Store, State } from 'root';
import { set } from 'core/common';

export interface GetCurrentUser {
  type: 'GET_CURRENT_USER';
}

export type Action = CoreAction | GetCurrentUser;

export function perform(action: Action, store: Store, state: State, callback: (store: Store, state: State, action: Action|null) => void) {
  switch (action.type) {
    case 'GET_CURRENT_USER':
      api.getCurrentUser((err, user) =>
        callback(set(store, {user}), state, null));
  }
};