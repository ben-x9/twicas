import { div } from 'core/html';
import { Update } from 'core/common';
import { Action } from 'actions';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, content, padding } from 'csstips';
import button from 'components/button';
import { userPath } from 'root';

export const view = (update: Update<Action>) =>
  div(style(padding(10), vertical, verticallySpaced(10), center), [
    div(style(content), 'hello world!'),
    button('start!', () => update({type: 'GOTO', path: userPath()})),
  ]);