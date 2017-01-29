import { div, input } from 'core/html';
import { VNode } from 'snabbdom/vnode';
import { style } from 'typestyle';
import { padding, horizontal } from 'csstips';
import { white, black } from 'colors';
import * as Card from 'components/card';
import flippable from 'components/flippable';
import { icon, tick, alignCenter, alignRight } from 'styles';
import { times } from 'lodash';
import { set, Update } from 'core/common';
import { defer } from 'lodash';

// MODEL

export type Store = Card.Store;
export const newStore = Card.newStore;

// UPDATE

interface SetCard {
  type: 'SET_CARD';
  face: 'front' | 'back';
  text: string;
}

interface Flip {
  type: 'FLIP';
};

interface StopEditing {
  type: 'STOP_EDITING';
}

export type Action = SetCard | Flip | StopEditing;
export type Effect = Flip | StopEditing | null;

export const update = (card: Store, action: Action): [Store, Effect] => {
  switch (action.type) {
    case 'SET_CARD':
      return [set(card, {[action.face]: action.text}), null];
    case 'FLIP':
      return [card, action];
    case 'STOP_EDITING':
      return [card, action];
  }
};


// VIEW

const cardClass = style(
  horizontal,
  padding(10), {
  color: white,
  backgroundColor: black,
  textAlign: 'center',
  borderRadius: '3px',
  cursor: 'pointer',
});

const textWithTicks = (card: Store, face: 'front' | 'back', update: Update<Action>, onclick: () => void, editable: boolean, isShowing: boolean, styleName?: string) =>
  div(styleName ? [cardClass, styleName] : cardClass, {on: {click: onclick}}, [
    editable ?
      input([
        alignCenter,
        style({
          textAlign: 'center',
          color: white,
          backgroundColor: black,
          outline: 'none',
          border: 'none',
          width: '90%',
        }),
      ], {
        props: {type: 'text', value: card[face]},
        on: {
          click: (e: Event) => e.stopPropagation(),
          input: (e: Event) => update({
            type: 'SET_CARD',
            face,
            text: (e.target as HTMLInputElement).value,
          }),
          keypress: (e: KeyboardEvent) => e.keyCode === 13 &&
            (face === 'front' ?
              update({type: 'FLIP'}) :
              update({type: 'STOP_EDITING'})),
        },
        hook: {
          insert: (vnode) =>
            isShowing && (vnode.elm as HTMLInputElement).focus(),
          update: (old, vnode) =>
            isShowing && (vnode.elm as HTMLInputElement).focus(),
        },
      }) :
      div(alignCenter, card[face]),
    div([style(alignRight, horizontal, {minHeight: '18px'})],
      times(card.score, () => div([style(icon)], tick))),
  ]);

export const view = (store: Card.Store, update: Update<Action>, flipped: boolean, gap: number, onclick: () => void, editable = false) =>
  flippable('list-item',
    'vert',
    flipped,
    textWithTicks(store, 'front', update, onclick, editable, !flipped, style({right: gap, left: gap})),
    textWithTicks(store, 'back', update, onclick, editable, flipped, style({right: gap, left: gap})),
  );