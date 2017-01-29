import { h } from 'snabbdom';
import { VNode, VNodeData } from 'snabbdom/vnode';
import { isObject, set } from 'core/common';

interface Name {
  name: string;
}

interface HyperScriptFunc {
  (name: Name, className: string | string[], data: VNodeData): VNode;
  (name: Name, className: string | string[], text: string): VNode;
  (name: Name, className: string | string[], children: VNode | Array<VNode>): VNode;
  (name: Name, className: string | string[], data: VNodeData, text: string): VNode;
  (name: Name, className: string | string[], data: VNodeData, children: VNode | Array<VNode>): VNode;

  (name: Name, data: VNodeData): VNode;
  (name: Name, text: string): VNode;
  (name: Name, children: VNode | Array<VNode>): VNode;
  (name: Name, data: VNodeData, text: string): VNode;
  (name: Name, data: VNodeData, children: VNode | Array<VNode>): VNode;

  (className: string | string[], data: VNodeData): VNode;
  (className: string | string[], text: string): VNode;
  (className: string | string[], children: VNode | Array<VNode>): VNode;
  (className: string | string[], data: VNodeData, text: string): VNode;
  (className: string | string[], data: VNodeData, children: VNode | Array<VNode>): VNode;

  (data: VNodeData): VNode;
  (text: string): VNode;
  (children: VNode | Array<VNode>): VNode;
  (data: VNodeData, text: string): VNode;
  (data: VNodeData, children: VNode | Array<VNode>): VNode;
}

type A = VNodeData | string | Array<VNode>;
type B = VNodeData | string | Array<VNode>;
type C = string | Array<VNode>;

// const isVNodeData = (x: any): x is VNodeData => isObject(x) && !x.sel;

const genNamedTag = (type: string, name: string, style: string, a?: any, b?: any) => {
  const sel = type +
    (process.env.NODE_ENV === 'development' && name ?
      '.' + name : '') +
    (style ? '.' + style : '');
  // return name ?
  //   isVNodeData(a) ?
  //     h(sel, set(a, {attrs: set(a.attrs || {}, {'data-name': name})}), b) :
  //     h(sel, {attrs: {'data-name': name}}, a) :
  return h(sel, a, b);
};

const genTag = (type: string, name: string, a?: any, b?: any, c?: any) =>
  (typeof a === 'string' || Array.isArray(a)) && b !== undefined ?
    genNamedTag(type, name, Array.isArray(a) ? a.join('.') : a, b, c) :
    genNamedTag(type, name, '', a, b);

export const tag = (type: string): HyperScriptFunc =>
  (a?: any, b?: any, c?: any, d?: any) =>
    isObject(a) && a.name ?
      genTag(type, a.name, b, c, d) :
      genTag(type, '', a, b, c);

export const div = tag('div');
export const input = tag('input');