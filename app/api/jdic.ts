import * as xhr from 'xhr';
import { ActionCallback, action } from 'core/api';
import virtualize from 'snabbdom-virtualize';
import { VNode } from 'snabbdom/vnode';

export function getExplanation(text: string, callback: ActionCallback<VNode[]>) {
  const cleanText = text
    .replace(/[\ud800-\udfff]/g, '')
    .replace('_', '');
  xhr.get({
    url: `https://xes56jrq8b.execute-api.us-west-2.amazonaws.com/wwwjdic/wwwjdic/cgi-data/wwwjdic?9ZIG${cleanText}`,
    responseType: 'document',
   }, (err, resp) => {
     if (err) throw err;
     const doc = resp.body as Document;
     action(callback, err, Array.prototype.map.call(
       doc.body.childNodes, (node: Node) => virtualize(node),
      ));
   });
}