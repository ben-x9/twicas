import { div, input } from 'core/html';
import { Update, Goto, goto, set } from 'core/common';
import { Effect } from 'core/effects';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, content, margin } from 'csstips';
import { view as button } from 'components/button';
import { userPath } from 'root';


// MODEL

export const state = {
  inputText: '',
};

export type State = Readonly<typeof state>;


// UPDATE

interface SetInputText {
  type: 'SET_INPUT_TEXT';
  text: string;
}

export type Action = Goto | SetInputText;

export function update(state: State, action: Action): [State, Effect] {
  switch (action.type) {
    case 'GOTO':
      return [state, action];
    case 'SET_INPUT_TEXT':
      return [set(state, {inputText: action.text}), null];
  }
}


// VIEW

export const view = (state: State, update: Update<Action>) =>
  div(style(margin(10), vertical, verticallySpaced(10), center), [
    div(style(content), 'enter user name'),
    input({
      props: {type: 'text', value: state.inputText},
      on: {
        input: (e: Event) => update({
          type: 'SET_INPUT_TEXT',
          text: (e.target as HTMLInputElement).value,
        }),
        keypress: (e: KeyboardEvent) => {
          if (e.keyCode === 13) update(goto(userPath({name: state.inputText})));
        },
      },
    }),
    button('submit', () => update(goto(userPath({name: state.inputText})))),
  ]);