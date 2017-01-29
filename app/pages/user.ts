import { div } from 'core/html';
import { style } from 'typestyle';
import { vertical, verticallySpaced, center, content, margin } from 'csstips';

export const newStore = null as any;
export type Store = typeof newStore;

export const view = (store: Store) =>
  div(style(margin(10), vertical, verticallySpaced(10), center), [
    div(style(content), "here's your token"),
    div(style(content), JSON.stringify(store, null, 2)),
  ]);