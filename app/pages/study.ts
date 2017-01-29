import { div } from 'core/html';
import { style, keyframes } from 'typestyle';
import { vertical, verticallySpaced, horizontal, horizontallySpaced, centerCenter, padding, width, height, flex, startJustified } from 'csstips';
import * as Card from 'components/card';
import { set, setIndex, Update } from 'core/common';
import button from 'components/button';
import { Goto, Effect } from 'core/effects';
import { listPath } from 'root';
import { icon, rightArrow, tick, cross, horizontalBar, alignRight } from 'styles';

// MODEL

export const newStore = [] as ReadonlyArray<Card.Store>;
export type Store = typeof newStore;

export const newState = {
  currentCard: 0,
  flipped: false,
  ok: false,
  ng: false,
};
export type State = Readonly<typeof newState>;

// UPDATE

interface Flip {
  type: 'FLIP';
}

interface Mark {
  type: 'MARK';
  correct: boolean;
}

interface Advance {
  type: 'ADVANCE';
}

export type Action = Flip | Mark | Advance | Goto;

const nextCard = (cards: Store, state: State) =>
  state.currentCard === cards.length - 1 ? 0 : state.currentCard + 1;

export const update = (cards: Store, state: State, action: Action): [Store, State, Effect] => {
  switch (action.type) {
    case 'FLIP':
      return [
        cards,
        set(state, {
          flipped: !state.flipped,
        }),
        null,
      ];
    case 'MARK':
      const oldCard = cards[state.currentCard];
      const newCard = !state.ng && !state.ok ?
        set(oldCard, {score: action.correct ? oldCard.score + 1 : 0}) :
        oldCard;
      return [
        setIndex(cards, state.currentCard, newCard),
        set(state, {
          ok: action.correct,
          ng: !action.correct,
          flipped: false,
        }),
        null,
      ];
    case 'ADVANCE':
      return [
        cards,
        set(state, {
          currentCard: nextCard(cards, state),
          flipped: false,
          ok: false,
          ng: false,
        }),
        null,
      ];
    case 'GOTO':
      return [
        cards,
        state,
        action,
      ];
  }
};

// VIEW

const abs = style({
  position: 'absolute',
});
const invisible = style({
  visibility: 'hidden',
});
const slideRight = keyframes({
  'to': {
    transform: 'rotateZ(30deg)',
    marginLeft: '120%',
    marginTop: '100px',
   },
});
const slideLeft = keyframes({
  'to': {
    transform: 'rotateZ(-30deg)',
    marginLeft: '-120%',
    marginTop: '100px',
   },
});
const ok = style({
  animationName: slideRight,
  animationDuration: '0.3s',
  animationTimingFunction: 'ease',
});
const ng = style({
  animationName: slideLeft,
  animationDuration: '0.3s',
  animationTimingFunction: 'ease',
});

export const view = (cards: Store, state: State, update: Update<Action>) => div(
  {name: 'study'},
  style(vertical, width('100%'), height('100%')), [
    div({name: 'nav-bar'}, horizontalBar, [
      button('List ' + rightArrow,
        () => update({type: 'GOTO', path: listPath()}),
        [alignRight, icon]
      ),
    ]),
    div({name: 'body'},
      style(
        flex,
        padding(10),
        vertical,
        verticallySpaced(10),
        centerCenter,
        width('100%'),
        height('100%'),
        {overflow: 'hidden'},
      ),
      {on: {click: () => update({type: 'FLIP'})}},
      div(style(vertical),
      [
        Card.view(
          cards[nextCard(cards, state)],
          false,
          [abs],
          {class: {[invisible]: !state.ok && !state.ng},
        }),
        Card.view(
          cards[state.currentCard],
          state.flipped,
          [],
          { on: {animationend: (e: AnimationEvent) =>
              (e.animationName === slideRight ||
               e.animationName === slideLeft) && update({type: 'ADVANCE'})},
            class: {[ok]: state.ok, [ng]: state.ng}},
        ),
      ]),
    ),
    div({name: 'button-bar'}, horizontalBar, [
      button(cross, () => update({type: 'MARK', correct: false}), [flex, icon]),
      button(tick, () => update({type: 'MARK', correct: true}), [flex, icon]),
    ]),
  ],
);
