import * as pathToRegexp from 'path-to-regexp';

const routes = [] as Route[];

interface Route {
  regexp: pathToRegexp.PathRegExp;
  params: string[];
  key: string;
}

export function reset() {
  routes.length = 0;
}

export function path(path: string, key: string): () => string {
  const params: string[] = [];
  routes.push({regexp: pathToRegexp(path, params), key, params});
  return pathToRegexp.compile(path);
}

export function match(path: string): {key: string | null, args: string[]} {
  let matchingRoute: Route | null = null;
  let args: string[] = [];
  for (let route of routes) {
    const match = route.regexp.exec(path);
    if (match) {
      matchingRoute = route;
      args = match.slice(1);
      break;
    }
  }
  return {key: matchingRoute ? matchingRoute.key : null, args};
}

export function readParam(name: string, decode = false) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results || !results[2]) return '';
  return decode ?
    decodeURIComponent(results[2].replace(/\+/g, ' ')) :
    results[2];
}