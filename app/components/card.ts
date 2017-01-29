import { div } from 'core/html';
import { style } from 'typestyle';
import { black, white } from 'csx';
import { vertical, centerJustified, width, height, padding } from 'csstips';
import * as textfit from 'textfit';
import { VNode, VNodeData } from 'snabbdom/VNode';
import flippable from 'components/flippable';
import { set } from 'core/common';
import { noselect } from 'styles';

// MODEL

export const newStore = (props?: Partial<Card>): Card =>
  set({
    front: '',
    back: '',
    score: 0,
    showNext: new Date(),
  } as Card, props || {});

interface Card {
  front: string;
  back: string;
  score: number;
  showNext: Date;
}
export type Store = Readonly<Card>;

// VIEW

const faceStyle = style(
  vertical,
  centerJustified,
  width(300),
  height(300),
  padding(15), {
  backgroundColor: black.toString(),
  color: white.toString(),
  borderRadius: 5,
  textAlign: 'center',
  cursor: 'pointer',
  },
);

const hook = {
  insert: (node: VNode) => textfit(<Node>node.elm),
  postpatch: (oldNode: VNode, node: VNode) => textfit(<Node>node.elm),
};

export const view = (store: Store, flipped: boolean, styles: string[] = [], data: VNodeData = {}) =>
  flippable('card',
    'horiz',
    flipped,
    div({name: 'front_face'}, faceStyle, {hook}, store.front),
    div({name: 'back_face'}, faceStyle, {hook}, store.back),
    styles.concat(noselect),
    data,
  );