import { div, img, h, VNode, newlineStrToBr } from 'core/html';
import { style } from 'typestyle';
import { horizontal, horizontallySpaced, vertical, verticallySpaced, center, padding, width, height } from 'csstips';
import { Action as GlobalAction } from 'actions';
import { percent } from 'csx';
import * as colors from 'colors';
import { Comment } from 'store/comment';
import { Update, set } from 'core/common';

export interface Store {
  comment: Comment;
  explanation?: ReadonlyArray<VNode>;
};

export const initialState = {
  showExplanation: false,
};
export type State = Readonly<typeof initialState>;

interface ToggleExplanation {
  type: 'TOGGLE_EXPLANATION';
}

export type Action = GlobalAction | ToggleExplanation;

export function update(action: Action, store: Store, state: State): [State, GlobalAction|null] {
  switch (action.type) {
    case 'TOGGLE_EXPLANATION': return [
      set(state, {
        showExplanation: !state.showExplanation,
      }),
      store.explanation ? null : {
        type: 'GET_COMMENT_EXPLANATION',
        commentId: store.comment.id,
      }];
    default: return [state, action];
  }
}

export const view = (store: Store, state: State, update: Update<Action>) =>
  div(
    style(
      padding(5),
      width(percent(100)),
      horizontal,
      horizontallySpaced(10),
    ),
    {key: store.comment.id},
    [
      img(style(
        width(40),
        height(40),
        {borderRadius: 5},
      ), {attrs: {src: store.comment.fromUser.image}}),
      div(style(vertical, verticallySpaced(10)), [
        div(style({
          color: colors.darkGray,
          fontWeight: 'bold',
          fontSize: 14,
        }), store.comment.fromUser.name),
        div(
          style(padding(10), {
            backgroundColor: colors.lightGray,
            borderRadius: 5,
            cursor: 'pointer',
          }), {
            on: {
              click: () => update({type: 'TOGGLE_EXPLANATION'}),
            },
          },
          newlineStrToBr(store.comment.message),
        ),
        state.showExplanation ?
          div(style(padding(10), {
            backgroundColor: colors.yellow,
            borderRadius: 5,
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: '16px',
          }), {
            on: {
              click: () => update({type: 'TOGGLE_EXPLANATION'}),
            },
          },
          store.explanation ?
            store.explanation as VNode[] :
            div('loading...')) :
          '',
      ]),
    ],
  );