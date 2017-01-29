declare module 'history/createBrowserHistory' {
  import { HistoryOptions, History } from 'history';
  export default function createBrowserHistory(options?: HistoryOptions): History;
}