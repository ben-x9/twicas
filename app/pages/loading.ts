import { div } from 'core/html';
import { style } from 'typestyle';
import { vertical, center, padding } from 'csstips';

export default () =>
  div(style(padding(10), vertical, center), [
    div('loading...'),
  ]);