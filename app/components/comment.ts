import { div, img } from 'core/html';
import { style } from 'typestyle';
import { horizontal, horizontallySpaced, vertical, verticallySpaced, center, padding, width, height } from 'csstips';
import { percent } from 'csx';
import * as colors from 'colors';
import { Comment } from 'store/comment';

export const view = (comment: Comment) =>
  div(style(
    padding(5),
    width(percent(100)),
    horizontal,
    horizontallySpaced(10), {
  }), {
    key: comment.id,
  }, [
    img(style(
      width(40),
      height(40),
      {borderRadius: 5},
    ), {attrs: {src: comment.fromUser.image}}),
    div(style(vertical, verticallySpaced(10)), [
      div(style({
        color: colors.darkGray,
        fontWeight: 'bold',
        fontSize: 14,
      }), comment.fromUser.name),
      div(style(padding(10), {
        backgroundColor: colors.lightGray,
        borderRadius: 5,
      }), comment.message),
    ]),
  ]);