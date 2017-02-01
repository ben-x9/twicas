export type Update<Action> = (update: Action) => void;

export interface Goto {
  type: 'GOTO';
  path: string;
}

export const goto = (path: string) => ({type: 'GOTO', path}) as Goto;

export function set<T extends Object>(object: T, props: Partial<T>): T {
  let unchanged = true;
  for (let prop in props) {
    if (object[prop] !== props[prop]) {
      unchanged = false;
      break;
    }
  }
  // typecasting necessary due to this bug
  // https://github.com/Microsoft/TypeScript/issues/12759
  return unchanged ? object : <T>{...object as Object, ...props as any as Object};
}

export function setIndex<T>(array: ReadonlyArray<T>, index: number, value: T): ReadonlyArray<T> {
  if (array[index] === value) {
    return array;
  } else {
    const clone = array.slice() as T[];
    clone[index] = value;
    return clone;
  }
}

export function delIndex<T>(array: ReadonlyArray<T>, index: number): ReadonlyArray<T> {
  const clone = (array as T[]).slice();
  clone.splice(index, 1);
  return clone;
}

export const isObject = (x: any) => typeof x === 'object' && !Array.isArray(x);

export function stop<T>(data: T): T {
  debugger;
  return data;
}