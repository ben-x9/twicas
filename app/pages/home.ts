import { div, input, VNode } from 'core/html';
import { Update, set } from 'core/common';
import { Action as GlobalAction } from 'core/actions';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, content, padding } from 'csstips';
import button from 'components/button';
import { commentsPath } from 'root';
import * as colors from 'colors';

export const state = {
  input: '',
};
export type State = Readonly<typeof state>;

export interface SetInput {
  type: 'SET_INPUT';
  value: string;
}

export type Action = SetInput | GlobalAction;

export function update(action: Action, state: State): [State, GlobalAction|null] {
  switch (action.type) {
    case 'SET_INPUT': return [set(state, {input: action.value}), null];
    default: return [state, action];
  }
}

export const view = (state: State, update: Update<Action>) => {
  document.body.style.backgroundColor = colors.lightGray;
  const gotoComments = () => update({
    type: 'GOTO',
    path: commentsPath({userId: state.input}),
  });
  return div(style(padding(10), vertical, verticallySpaced(10), center), [
    div(style(content), 'enter user id'),
    input(style({textAlign: 'center'}), {
      props: {type: 'text', value: state.input},
      on: {
        input: (e: Event) => update({
          type: 'SET_INPUT',
          value: (e.target as HTMLInputElement).value,
        }),
        keypress: (e: KeyboardEvent) => e.keyCode === 13 && gotoComments(),
      },
      hook: {
        insert: (vnode: VNode) => (vnode.elm as HTMLElement).focus(),
        update: (vnode: VNode) => (vnode.elm as HTMLElement).focus(),
      },
    }),
    button('OK', () => gotoComments()),
  ]);
};