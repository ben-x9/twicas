import { path, match, reset, readParam } from 'core/router';
import { Effect, Redirect, Goto, RefreshView } from 'core/effects';
import { set, Update, goto } from 'core/common';
import * as NotFound from 'pages/not-found';
import * as Home from 'pages/home';
import * as Login from 'pages/login';
import * as User from 'pages/user';
import * as Study from 'pages/study';
import * as List from 'pages/list';
import { lightGray } from 'colors';
import wait from 'pages/wait';
import { fetchAccessToken, loadAccessToken, authUrl, getUserData, getComments, getCurrentLive } from 'twit';
import { defer } from 'lodash';

if (module.hot) module.hot.dispose(() => {
  reset();
  clearTimeout(timerId);
});


// MODEL

export const newStore = {
  user: User.newStore,
};
export type Store = Readonly<typeof newStore>;

export const newState = {
  login: Login.state,
  study: Study.newState,
  list: List.newState,
};
export type State = Readonly<typeof newState>;


// UPDATE

interface HomeAction {
  type: 'HOME';
  action: Home.Action;
}

interface SetUserData {
  type: 'SET_USER_DATA';
  token: string;
}

export type Action = HomeAction | SetUserData | Redirect | Goto | RefreshView;

export function update(store: Store, state: State, action: Action): [Store, State, Effect] {
  let newStore: Store = store;
  let newState: State = state;
  let effect: Effect = null;
  switch (action.type) {
    case 'HOME':
      effect = Home.update(action.action);
      break;
    case 'GOTO':
    case 'REFRESH_VIEW': return [store, state, action];
  }
  return [newStore, newState, effect];
};


// VIEW

document.body.style.backgroundColor = lightGray;

type Path<Data extends Object> = (data: Data) => string;

// export const homePath = path('/', 'HOME');
// export const loginPath = path('/login', 'LOGIN');
// export const userPath: Path<{name: string}> = path('/user/:name', 'USER');

export const homePath = path('/', 'HOME');
export const twitAuthPath = path('/twit_auth', 'TWIT_AUTH');
export const userPath = path('/user', 'USER');

export const commentsPath = path('/comments/:id', 'COMMENTS');

export function view(store: Store, state: State, path: string, update: Update<Action>) {
  const loading = loadData(store, update);
  if (loading) return loading;
  const route = match(path);
  switch (route.key) {
    case 'HOME':
      return Home.view((action: Home.Action) =>
        update({type: 'HOME', action}));
    case 'TWIT_AUTH':
      return handleTwitAuthCallback(update);
    // case 'LOGIN':
    //   return Login.view(state.login, (action: Home.Action) =>
    //     update({type: 'LOGIN', action}));
    case 'USER':
      return User.view(store.user);
    // case 'COMMENTS':
    //   return Comments.view(store.c);
    default: return NotFound.view();
  }
}

function loadData(store: Store, update: Update<Action>) {
  let loading = false;
  loading = loadAccessToken(() => defer(() =>
    update({type: 'REDIRECT', url: authUrl})));
  if (loading) return wait();
  return null;
};

function handleTwitAuthCallback(update: Update<Action>) {
  const code = readParam('code');
  fetchAccessToken(code, () => update({type: 'REFRESH_VIEW'}));
  return wait();
}

const id = 'c:4_shiki';

const timerId = setTimeout(() => {
  pollForComments(id);
}, 3000);

function pollForComments(id: string) {
  getCurrentLive(id, (err, data: any) => {
    getComments(data.movie.id, (err, data) => {
      debugger;
    });
  });
}


// import * as xhr from 'xhr';

// import { url, clientId, clientSecret } from '../twit-config';

// xhr(`${url}oauth2/authorize?client_id=${clientId}&response_type=code`, (err, resp) => {
//   debugger;
//   // xhr.post(`${url}/oauth2/access_token?code=${}`, (err, resp) => {
//   //   debugger;
//   // });
//  });
