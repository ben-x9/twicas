declare module 'xhr-request' {
  function xhrRequest(url: string, opts: {[key: string]: any}, callback: (err: any, data: any) => void): void;
  namespace xhrRequest {}
  export = xhrRequest;
}