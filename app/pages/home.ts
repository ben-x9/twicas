import { div } from 'core/html';
import { Update } from 'core/common';
import { Redirect } from 'core/effects';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, content, margin } from 'csstips';
import button from 'components/button';
import { authUrl } from 'twit';

export type Action = Redirect;

export const update = (action: Action) => action;

export const view = (update: Update<Action>) =>
  div(style(margin(10), vertical, verticallySpaced(10), center), [
    div(style(content), 'hello world!'),
    button('start!', () => update({type: 'REDIRECT', url: authUrl})),
  ]);