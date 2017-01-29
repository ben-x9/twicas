import { style } from 'typestyle';
import { padding, horizontal, horizontallySpaced } from 'csstips';
import { toolbarGray } from 'colors';

export const noselect = style({
  // $debugName: 'noselect',
  '-webkit-touch-callout': 'none', /* iOS Safari */
  '-webkit-user-select': 'none', /* Safari */
  '-moz-user-select': 'none', /* Firefox */
  '-ms-user-select': 'none', /* Internet Explorer/Edge */
  userSelect: 'none', /* Non-prefixed version, currently
                        supported by Chrome and Opera */
});


export const horizontalBar = style(
  horizontal,
  horizontallySpaced(3),
  padding(3),
  {backgroundColor: toolbarGray},
);

export const alignCenter = style({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
});

export const alignRight = {marginLeft: 'auto'};

export const icon = {fontFamily: 'FontAwesome, Arial, Helvetica, sans serif'};
export const rightArrow = '\uf061';
export const leftArrow = '\uf060';
export const plus = '\uf067';
export const tick = '\uf00c';
export const cross = '\uf00d';