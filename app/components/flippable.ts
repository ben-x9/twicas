import { div } from 'core/html';
import { style } from 'typestyle';
import { vertical, content } from 'csstips';
import { VNode, VNodeData } from 'snabbdom/VNode';
import { set } from 'core/common';

const baseClass = style({
  transition: 'transform 0.2s linear',
  backfaceVisibility: 'hidden',
  '-webkit-backface-visibility': 'hidden',
});

const frontClass = style({
  $debugName: 'front',
  zIndex: 2,
});

const abs = style({
  position: 'absolute',
});

const flipHorizClass = style({transform: 'rotateY(180deg)'});
const flipVertClass = style({transform: 'rotateX(180deg)'});

export default (name: string, direction: 'horiz' | 'vert', flipped: boolean, front: VNode, back: VNode, styleClass: string | string[] = '', data: VNodeData = {}) => {
  const flipClass = direction === 'horiz' ? flipHorizClass : flipVertClass;
  return div({name},
    [
      style(vertical, content),
      ...(Array.isArray(styleClass) ? styleClass : [styleClass]),
    ],
    div(
      {name: 'flipper'},
      style(vertical, content),
      data,
      [
        set(front, {
          sel: `${front.sel}.${baseClass}.${frontClass}.${flipClass}.${abs}`,
          data: set(front.data || {}, {
            class: set((front.data || {}).class || {}, {[flipClass]: flipped}),
          }),
        }),
        set(back, {
          sel: `${back.sel}.${baseClass}.${flipClass}`,
          data: set(back.data || {}, {
            class: set((back.data || {}).class || {}, {[flipClass]: !flipped}),
          }),
        }),
      ],
    ),
  );
};