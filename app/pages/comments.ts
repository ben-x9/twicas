import { div, img } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, padding, width } from 'csstips';
import { percent } from 'csx';
import { User } from 'store/user';
import loading from 'pages/loading';
import { Action } from 'actions';
import { Update, stop } from 'core/common';
import { Store, Errors } from 'root';
import * as colors from 'colors';
import * as CommentComponent from 'components/comment';

export const view = (userId: string, store: Store, update: Update<Action>, errors: Errors) =>
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
        div(style(padding(10), vertical, verticallySpaced(10), center, {maxWidth: 400}), [
          img(style({borderRadius: 5}), {attrs: {src: store.user.image}}),
          div(style({
            color: colors.darkGray,
            fontWeight: 'bold',
          }), store.user.name),
          div(store.user.profile),
        ]),
        div(
          style(vertical, verticallySpaced(10), {maxWidth: 360}, center),
            errors.comments ?
              [div(errors.comments)] :
            store.comments.length === 0 ?
              [div('loading comments...')] :
            store.comments.map(comment => CommentComponent.view(comment)),
        ),
      ],
    );