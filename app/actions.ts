import { Action as CoreAction } from 'core/actions';
import * as twicas from 'api/twicas';
import * as jdic from 'api/jdic';
import { Store, State } from 'root';
import { set, stop } from 'core/common';
import * as lo from 'lodash';
import { Comment } from 'store/comment';

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

export interface GetCommentExplanation {
  type: 'GET_COMMENT_EXPLANATION';
  commentId: string;
}

export type Action = CoreAction | GetCurrentUser | SubscribeComments | UnsubscribeComments | GetCommentExplanation;

let timerId: number | null = null;

export function perform(action: Action, store: Store, state: State, callback: (store: Store, state: State, action?: Action|null) => void) {
  switch (action.type) {

    case 'GET_CURRENT_USER':
      twicas.getCurrentUser((err, store, state, user) =>
        callback(set(store, {user}), state, null));
      break;

    case 'SUBSCRIBE_COMMENTS':
      if (timerId !== null) clearInterval(timerId);

      twicas.getUser(action.userId, (err, store, state, user) =>
        err ?
          callback(store, set(state, {
            errors: set(state.errors, {user: err.message}),
          })) :
          callback(set(store, {user}), state));

      twicas.getCurrentLiveId(action.userId, (err, store, state, liveId) => {
        if (err) {
          callback(store, set(state, {
            errors: set(state.errors, {comments: err.message}),
          }));
        } else {
          const getComments = () =>
            twicas.getComments(liveId, (err, store, state, comments) =>
              callback(set(store, {
              comments: lo(comments.concat(store.comments))
                .sortBy('id')
                .sortedUniqBy('id')
                .value()
                .reverse(),
              }), state));
          getComments();
          timerId = setInterval(() => getComments(), 3000);
        }
      });
      return false;

    case 'UNSUBSCRIBE_COMMENTS':
      if (timerId !== null) clearInterval(timerId);
      break;

    case 'GET_COMMENT_EXPLANATION':
      jdic.getExplanation(
        (store.comments.find(c =>
          c.id === action.commentId) as Comment).message,
        (err, store, state, result) =>
          callback(set(store, {explanations: set(
            store.explanations, {[action.commentId]: result},
          )}), state),
      );
      break;
  }
  return true;
};

