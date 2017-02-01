export interface Goto {
  type: 'GOTO';
  path: string;
}

// Goto without storing the previous path in the browser history
export interface GotoSilently {
  type: 'GOTO_SILENTLY';
  path: string;
}

export interface Redirect {
  type: 'REDIRECT';
  url: string;
}

export interface RefreshView {
  type: 'REFRESH_VIEW';
}

export type Action = Goto | GotoSilently | Redirect | RefreshView;