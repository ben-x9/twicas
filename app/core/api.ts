import { Store, State } from 'root';

interface Global extends Window {
  // ensure callbacks always access the latest data
  store: Store;
  state: State;
}
export const global = window as Global;

export type Callback<T> = (error: Error|null, data: T) => void;
export type ActionCallback<T> = (error: Error|null, store: Store, state: State, data: T) => void;

export function action<T>(callback: ActionCallback<T>, err: Error | null, data: T) {
  callback(err, global.store, global.state, data);
};

