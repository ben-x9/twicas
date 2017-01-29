type anyObject = {[key: string]: any};

declare module 'xhr' {

  interface Response {
    body: anyObject | string,
    statusCode: number,
    method: string,
    headers: anyObject,
    url: string,
    rawRequest: any
  }

  interface RequestOptions {
    useXDR?: boolean,
    sync?: boolean,
    uri?: string,
    url?: string,
    method?: string,
    timeout?: number,
    headers?: anyObject,
    body?: string | anyObject,
    json?: boolean | anyObject,
    username?: string,
    password?: String,
    withCredentials?: boolean,
    responseType?: string,
    beforeSend?: () => void,
  }

  type CallbackType = (error: Error, response: Response, body: XMLHttpRequest) => void;

  function xhr(options: string | RequestOptions, callback: CallbackType): void;

  namespace xhr {
    function post(options: string | RequestOptions, callback: Callback): void;
    function get(options: string | RequestOptions, callback: Callback): void;
    type Callback = CallbackType;
  }
  export = xhr;
}