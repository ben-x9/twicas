import { div } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, padding, width } from 'csstips';
import * as ListItem from 'components/list-item';
import { set, Update, setIndex } from 'core/common';
import { horizontalBar, icon, leftArrow, plus, alignRight } from 'styles';
import button from 'components/button';
import { studyPath } from 'root';
import { Goto, Effect } from 'core/effects';

// MODEL

export const newStore = [] as ReadonlyArray<ListItem.Store>;
export type Store = typeof newStore;

export const newState = {
  flippedItem: null as number | null,
  editingItem: null as number | null,
};
export type State = typeof newState;

// UPDATE

interface Flip {
  type: 'FLIP';
  index: number | null;
}

interface AddCard {
  type: 'ADD_CARD';
}

interface ListItem {
  type: 'LIST_ITEM';
  index: number;
  action: ListItem.Action;
}

export type Action = Flip | Goto | AddCard | ListItem;

export const update = (store: Store, state: State, action: Action): [Store, State, Effect] => {
  switch (action.type) {
    case 'FLIP':
      return [store, set(state, {
        flippedItem: state.flippedItem === action.index ? null : action.index,
      }), null];
    case 'GOTO':
      return [store, state, action];
    case 'ADD_CARD':
      return [
        store.concat(ListItem.newStore()),
        set(state, {editingItem: store.length}),
        null,
      ];
    case 'LIST_ITEM':
      const [newCard, effect] = ListItem.update(store[action.index], action.action);
      let newStore = setIndex(store, action.index, newCard);
      let newEffect: Effect = null;
      if (effect) {
        switch (effect.type) {
          case 'FLIP':
            [newStore, state, newEffect] = update(newStore, state, {
              type: 'FLIP', index: action.index,
            });
            break;
          case 'STOP_EDITING':
            state = set(state, {editingItem: null});
            break;
        }
      }
      return [newStore, state, newEffect];
  }
};

// VIEW

const gap = 2;

export const view = (cards: Store, state: State, update: Update<Action>) =>
  div({name: 'list-view'}, style(vertical, width('100%')), [
    div({name: 'nav-bar'}, horizontalBar, [
      button(leftArrow + ' Study', () => update({type: 'GOTO', path: studyPath()}), [icon]),
      button(plus, () => update({type: 'ADD_CARD'}), [icon, alignRight]),
    ]),
    div(style(vertical, padding(gap), verticallySpaced(gap)),
      cards.slice().reverse().map((item, j) => {
        const i = (cards.length - 1) - j; // index of card when not reversed
        return ListItem.view(item,
          (action: ListItem.Action) => // update function
            update({type: 'LIST_ITEM', index: i, action}),
          i === state.flippedItem, // flipped?
          gap,
          () => update({type: 'FLIP', index: i}), // onclick
          i === state.editingItem, // editing?
        );
      }),
    ),
  ]);
