import { div } from 'core/html';
import { style, types } from 'typestyle';
import { buttonGray, buttonHoverGray } from 'colors';
import { content, padding } from 'csstips';
import { noselect } from 'styles';

export default (label: string, onclick: () => void, styles: types.NestedCSSProperties[] = []) =>
  div({name: 'button'}, [style(content, padding(10), {
    backgroundColor: buttonGray,
    cursor: 'pointer',
    borderRadius: '3px',
    textAlign: 'center',
    minWidth: '45px',
    $nest: {
      '&:hover': {
        backgroundColor: buttonHoverGray,
      },
    },
  }, ...styles), noselect], {on: {click: onclick}}, label);