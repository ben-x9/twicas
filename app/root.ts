import { path, match, reset, readParam, Path } from 'core/router';
import { Action as GlobalAction } from 'actions';
import { Update, set } from 'core/common';
import * as NotFound from 'pages/not-found';
import * as HomePage from 'pages/home';
import * as UserPage from 'pages/user';
import * as CommentsPage from 'pages/comments';
import { User } from 'store/user';
import { Comment } from 'store/comment';
import loading from 'pages/loading';
import * as twicas from 'api/twicas';
import { VNode } from 'core/html';

if (module.hot) module.hot.dispose(() => {
  reset();
});

// MODEL

export const initialStore = {
  user: null as User | null,
  comments: [] as ReadonlyArray<Comment>,
  explanations: {} as ByKey<ReadonlyArray<VNode>>,
};
export type Store = Readonly<typeof initialStore>;

export const initialErrors = {
  user: '',
  comments: '',
};

export const initialState = {
  errors: initialErrors,
  homePage: HomePage.initialState,
  commentsPage: CommentsPage.initialState,
};
export type State = Readonly<typeof initialState>;
export type Errors = Readonly<typeof initialErrors>;

// UPDATE

export interface HomePageAction {
  type: 'HOME_PAGE';
  action: HomePage.Action;
}

export interface CommentsPageAction {
  type: 'COMMENTS_PAGE';
  action: CommentsPage.Action;
}

export type Action = GlobalAction | HomePageAction | CommentsPageAction;

export function update(action: Action, store: Store, state: State): [Store, State, GlobalAction|null] {
  let newStore = store;
  let newState = state;
  let reaction = null as null|GlobalAction;
  switch (action.type) {
    case 'HOME_PAGE':
      let newHomePageState: HomePage.State;
      [newHomePageState, reaction] = HomePage.update(action.action, state.homePage);
      newState = set(state, {homePage: newHomePageState});
      break;
    case 'COMMENTS_PAGE':
      let newCommentsPageState: CommentsPage.State;
      [newCommentsPageState, reaction] = CommentsPage.update(action.action, store, state.commentsPage);
      newState = set(state, {commentsPage: newCommentsPageState});
      break;
    default:
      reaction = action;
      break;
  }
  if (reaction && reaction.type === 'GOTO') {
    newStore = initialStore;
    newState = set(newState, {errors: initialErrors});
  }
  return [newStore, newState, reaction];
};

// VIEW

export const homePage = path('/', 'HOME');
export const twitAuthPath = path('/twicas_auth', 'TWICAS_AUTH');
export const userPage = path('/user', 'USER');

export const commentsPage: Path<{userId: string}> =
  path('/:userId', 'COMMENTS');

export function view(store: Store, state: State, path: string, update: Update<Action>) {
  const route = match(path);
  switch (route.key) {
    case 'HOME':
      return HomePage.view(state.homePage, (action: HomePage.Action) =>
        update({type: 'HOME_PAGE', action}));
    case 'TWICAS_AUTH':
      const code = readParam('code');
      twicas.fetchAccessToken(code, () => update({
        type: 'GOTO_SILENTLY',
        path: localStorage.getItem('returnToPath') as string,
      }));
      return loading();
    case 'USER':
      return UserPage.view(store.user, update);
    case 'COMMENTS':
      return CommentsPage.view(route.args[0], store, state.commentsPage, (action: CommentsPage.Action) => update({type: 'COMMENTS_PAGE', action}), state.errors);
    default: return NotFound.view();
  }
}