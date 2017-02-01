import { div, img } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, padding } from 'csstips';
import { User } from 'store/user';
import loading from 'pages/loading';
import { Action } from 'actions';
import { Update } from 'core/common';
import { Store } from 'root';
import * as colors from 'colors';
import * as CommentComponent from 'components/comment';

export const view = (userId: string, store: Store, update: Update<Action>) =>
  div(
    style(padding(10), vertical, verticallySpaced(10), center),
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
    [
      store.user ?
        div(style(padding(10), vertical, verticallySpaced(10), center), [
          div(store.user.name),
          div(store.user.profile),
          img({attrs: {src: store.user.image}}),
        ]) : '',
      div(
        style(vertical, verticallySpaced(10), {maxWidth: 400}),
        store.comments.map(comment => CommentComponent.view(comment)),
      ),
    ],
  );