import { div, img } from 'core/html';
import { style } from 'typestyle';
import { horizontal, horizontallySpaced, vertical, verticallySpaced, center, padding, width } from 'csstips';
import { percent } from 'csx';
import * as colors from 'colors';
import { Comment } from 'store/comment';

export const view = (comment: Comment) =>
  div(style(padding(10), width(percent(100), ), {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
  }), {
    key: comment.id,
  }, comment.message);