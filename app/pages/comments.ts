import { div, img } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, padding, width, margin } from 'csstips';
import { Action as GlobalAction } from 'actions';
import { Update, set } from 'core/common';
import { Store, Errors } from 'root';
import * as colors from 'colors';
import * as CommentComponent from 'components/comment';
import { Comment } from 'store/comment';

export const initialState = {
  comments: {} as ByKey<CommentComponent.State>,
};
export type State = Readonly<typeof initialState>;

export interface CommentComponentAction {
  type: 'COMMENT_COMPONENT';
  id: string;
  action: CommentComponent.Action;
}

export type Action = GlobalAction | CommentComponentAction;

export function update(action: Action, store: Store, state: State): [State, GlobalAction|null] {
  let newState = state;
  let reaction = null as null|GlobalAction;
  switch (action.type) {
    case 'COMMENT_COMPONENT':
      const comment =
        store.comments.find(comment => comment.id === action.id) as Comment;
      let newCommentState: CommentComponent.State;
      [newCommentState, reaction] = CommentComponent.update(action.action, {
        comment, explanation: store.explanations[action.id],
      }, state.comments[action.id] || CommentComponent.initialState);
      newState = set(state, {
        comments: set(state.comments, {[action.id]: newCommentState}),
      });
      break;
    default:
      reaction = action;
      break;
  }
  return [newState, reaction];
}

export const view = (userId: string, store: Store, state: State, update: Update<Action>, errors: Errors) =>
    div(
      style(padding(10), vertical, verticallySpaced(15), center),
      {
        key: 'comments',
        hook: {
          create: () => {
            document.body.style.backgroundColor = colors.white;
            update({type: 'SUBSCRIBE_COMMENTS', userId});
          },
          destroy: () => update({type: 'UNSUBSCRIBE_COMMENTS', userId}),
        },
      },
      errors.user ?
        div(errors.user) :
      !store.user ?
        div('loading...') :
      [
        div(style(padding(10), vertical, verticallySpaced(10), center, {maxWidth: 500, textAlign: 'center'}), [
          img(style({borderRadius: 5}), {attrs: {src: store.user.image}}),
          div(style({
            color: colors.darkGray,
            fontWeight: 'bold',
          }), store.user.name),
          div(store.user.profile),
        ]),
        div(
          style(vertical, verticallySpaced(10), padding(20), {maxWidth: 460}, center),
            errors.comments ?
              [div(errors.comments)] :
            store.comments.length === 0 ?
              [div('loading comments...')] :
            store.comments.map(comment =>
              CommentComponent.view(
                {comment, explanation: store.explanations[comment.id]},
                state.comments[comment.id] || CommentComponent.initialState,
                (action: CommentComponent.Action) => update({
                  type: 'COMMENT_COMPONENT',
                  id: comment.id,
                  action,
                }),
              )),
        ),
      ],
    );