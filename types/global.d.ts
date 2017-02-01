interface ReadonlyArray<T> {
  readonly length: number;
  /**
   * Returns a section of an array.
   * @param start The beginning of the specified portion of the array.
   * @param end The end of the specified portion of the array.
   */
  slice(start?: number, end?: number): Array<T>;
  readonly [n: number]: T;
}

declare var require: any;

declare type primitive = string | boolean | number;

declare type ByKey<T> = {[key: string]: T};