import { div } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, padding } from 'csstips';
import { User } from 'store/user';
import wait from 'pages/wait';
import { Action } from 'actions';
import { Update } from 'core/common';

export const view = (user: User|null, update: Update<Action>) =>
  user ?

    div(style(padding(10), vertical, verticallySpaced(10), center), [
      div(user.name),
      div(user.profile),
    ]) :

    (update({type: 'GET_CURRENT_USER'}), wait());