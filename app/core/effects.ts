export interface Goto {
  type: 'GOTO';
  path: string;
}

export interface Redirect {
  type: 'REDIRECT';
  url: string;
}

export interface RefreshView {
  type: 'REFRESH_VIEW';
}

export type Effect = null | Goto | Redirect | RefreshView;