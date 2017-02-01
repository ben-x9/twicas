import { div, img } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, padding } from 'csstips';
import * as colors from 'colors';
import { Comment } from 'store/comment';

export const view = (comment: Comment) =>
  div(style(padding(10), {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
  }), {
    key: comment.id,
  }, comment.message);