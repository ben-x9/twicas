declare module 'snabbdom-virtualize' {
  import { VNode } from 'snabbdom/vnode';
  export default function virtualize(node: Node): VNode;
}