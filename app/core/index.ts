import { init, h } from 'snabbdom';
import { VNode } from 'snabbdom/VNode';
import snabbClass from 'snabbdom/modules/class';
import snabbProps from 'snabbdom/modules/props';
import snabbStyle from 'snabbdom/modules/style';
import snabbEvent from 'snabbdom/modules/eventlisteners';
import snabbAttrs from 'snabbdom/modules/attributes';
const patch = init([ // init patch function with choosen modules
  snabbClass, // makes it easy to toggle classes
  snabbProps, // for setting properties on DOM elements
  snabbStyle, // handles styling on elements with support for animations
  snabbEvent, // attaches event listeners
  snabbAttrs,  // for setting attr on DOM elements
]);

let unlisten: () => void;

// enable webpack hot module replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    unlisten();
  });
}

import * as Root from 'root';
import { defer, debounce } from 'lodash';
import * as Actions from 'actions';
import { omit } from 'lodash';

interface Global extends Window {
  // expose the model and state globally so we can view in the console
  data: Root.Store;
  state: Root.State;
  // make view a global because cannot `x = x || y` when x is a local
  view: VNode | HTMLElement;
  loaded: Boolean;
  scrollTop: ByKey<number>;
}
const global = window as Global;
global.view = global.view || document.getElementById('root') as HTMLElement;
global.scrollTop = global.scrollTop || {};

import * as csstips from 'csstips';
csstips.normalize();
csstips.setupPage('#root');

import createHistory from 'history/createBrowserHistory';
const history = createHistory();

interface GoBack {
  type: 'POP';
  path: string;
  state: Root.State;
}

type Action = Root.Action | GoBack;

import { create } from 'jsondiffpatch';
const json = create();

if (!global.data) global.data = Root.store;
if (!global.state) global.state = Root.state;

function update(action: Action) {
  const [newData, newState, reaction] =
    action.type === 'POP' ?
      [ global.data,
        /*json.diff(state, action.state) ? action.state :*/ global.state,
        null] :
      Root.update(global.data, global.state, action);
  applyUpdate(action, newData, newState, reaction);
}

function applyUpdate(action: Action, newData: Root.Store, newState: Root.State, reaction: Actions.Action|null) {
  if (process.env.NODE_ENV === 'development')
    logAction(action, newData, newState, reaction);
  const shouldRefresh = newData !== global.data || newState !== global.state;
  if (action.type !== 'POP' && newState !== global.state)
    history.replace(history.location.pathname, newState);
  global.data = newData;
  global.state = newState;
  if (reaction) {
    perform(reaction);
  } else if (shouldRefresh || action.type === 'POP') {
    refreshView();
  }
}

function perform(action: Actions.Action) {
  if (!action) return;
  switch (action.type) {
    case 'GOTO':
      history.push(action.path, global.state);
      refreshView();
      break;
    case 'REDIRECT':
      window.location.replace(action.url);
      break;
    case 'REFRESH_VIEW':
      refreshView();
      break;
    default:
      Actions.perform(action, global.data, global.state,
        (newData, newState, nextAction) =>
          applyUpdate(action, newData, newState, nextAction));
  }
}

function logAction(action: Action, data: Root.Store, state: Root.State, reaction: Actions.Action|null) {
  let actionPath = action.type;
  let actualAction: any = action;
  while (actualAction.action) {
    actualAction = actualAction.action;
    actionPath += ' / ' + actualAction.type;
  }
  actionPath += ' ' + JSON.stringify(omit(actualAction, 'type'));
  let msg = actionPath;
  if (data !== global.data)
    msg += '\n-> data ' + JSON.stringify(json.diff(global.data, data));
  if (state !== global.state)
    msg += '\n-> state ' + JSON.stringify(json.diff(global.state, state));
  if (reaction)
    msg += '\n-> reaction ' + JSON.stringify(reaction);
  console.log(msg);
}

defer(refreshView);
unlisten = history.listen((location, action) => {
  if (action === 'POP') {
    update({
      type: 'POP',
      path: location.pathname,
      state: <Root.State>(location.state || global.state),
    });
  }
});

import { set } from 'core/common';
import { match } from 'core/router';

function refreshView() {
  let view = Root.view(
    global.data,
    global.state,
    history.location.pathname,
    update,
  );
  const key = match(history.location.pathname).key as string;
  view = set(view, {
    data: set(view.data || {}, {
      hook: set((view.data || {}).hook || {}, {
        insert: () => {
          window.scrollTo(0, global.scrollTop[key] || 0);
          window.onscroll = debounce(() =>
            global.scrollTop[key] = window.scrollY, 100);
        },
        update: () =>
          defer(() => window.scrollTo(0, global.scrollTop[key] || 0)),
      }),
    }),
  });
  global.view = patch(global.view, h('div#root', view));
}

// if (!global.loaded) {
//   Root.load(global.store, (store: Root.Store) => {
//     global.store = store;
//     refreshView();
//   });
//   global.loaded = true;
// }