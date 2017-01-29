import { div } from 'core/html';
import { style } from 'typestyle';
import { vertical, center, margin } from 'csstips';

export default () =>
  div(style(margin(10), vertical, center), [
    div('please wait...'),
  ]);