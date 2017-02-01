import { tag, newlineToBr, br } from 'core/html';
import { assert } from 'chai';

describe('tag', () => {
  it('should set css class to the name arg when present', () => {
    const vnode = tag('div')({name: 'hello'}, 'hello world!');
    assert.strictEqual(vnode.sel, 'div.hello');
  });
  it('should not set a css class when name arg is missing', () => {
    const vnode = tag('div')('hello world!');
    assert.strictEqual(vnode.sel, 'div');
  });
});

describe('newlineToBr', () => {
  it('should convert newline chars to br tags', () => {
    assert.deepEqual(
      newlineToBr('hello\nworld'),
      ['hello', br, 'world'],
    );
    assert.deepEqual(
      newlineToBr('hello\nworld\n\nhave a nice day'),
      ['hello', br, 'world', br, '', br, 'have a nice day'],
    );
  });
});