import { path, match, reset, readParam, Path } from 'core/router';
import { Action } from 'actions';
import { Update } from 'core/common';
import * as NotFound from 'pages/not-found';
import * as Home from 'pages/home';
import * as UserPage from 'pages/user';
import { User } from 'store/user';
import { lightGray } from 'colors';
import wait from 'pages/wait';
import * as api from 'api';

if (module.hot) module.hot.dispose(() => {
  reset();
  // clearTimeout(timerId);
});

// MODEL

export const store = {
  user: null as User | null,
};
export type Store = Readonly<typeof store>;

export const state = {
};
export type State = Readonly<typeof state>;

// UPDATE

export type Action = Action;

export function update(data: Store, state: State, action: Action): [Store, State, Action|null] {
  return [data, state, action];
};

// VIEW

document.body.style.backgroundColor = lightGray;

export const homePath = path('/', 'HOME');
export const twitAuthPath = path('/twit_auth', 'TWIT_AUTH');
export const userPath = path('/user', 'USER');

export const commentsPath = path('/comments/:id', 'COMMENTS');

export function view(store: Store, state: State, path: string, update: Update<Action>) {
  const route = match(path);
  switch (route.key) {
    case 'HOME':
      return Home.view(update);
    case 'TWIT_AUTH':
      const code = readParam('code');
      api.fetchAccessToken(code, () => update({type: 'REFRESH_VIEW'}));
      return wait();
    case 'USER':
      return UserPage.view(store.user, update);
    default: return NotFound.view();
  }
}

// function loadData(store: Store, update: Update<Action>) {
//   let loading = false;
//   loading = loadAccessToken(() => defer(() =>
//     update({type: 'REDIRECT', url: authUrl})));
//   if (loading) return wait();
//   return null;
// };

// api.verifyCredentials((err, data) => {debugger});

// const id = 'c:4_shiki';

// const timerId = setTimeout(() => {
//   pollForComments(id);
// }, 3000);

// function pollForComments(id: string) {
//   getCurrentLive(id, (err, data: any) => {
//     getComments(data.movie.id, (err, data) => {
//       debugger;
//     });
//   });
// }


// import * as xhr from 'xhr';

// import { url, clientId, clientSecret } from '../twit-config';

// xhr(`${url}oauth2/authorize?client_id=${clientId}&response_type=code`, (err, resp) => {
//   debugger;
//   // xhr.post(`${url}/oauth2/access_token?code=${}`, (err, resp) => {
//   //   debugger;
//   // });
//  });
