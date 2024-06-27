import { Tool } from '~/models/tool'
import { WithClass } from '~/models/with-class'
import { emitToolUpdated } from '../$'
import { css } from 'solid-styled-components'
import { JSX } from 'solid-js/jsx-runtime'

const baseStyle = css`
  position: relative;
  overflow: hidden;
  padding: 0.5rem;
  border: solid 1px rgba(215, 196, 187, 0.2);
  cursor: pointer;
  border-radius: 50%;  // 常に円形を維持
  transition: background-color 0.3s ease;  // スムーズな背景色の変化
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(215, 196, 187, 0.2);
    transition: transform 0.6s, opacity 1s;
    transform: translate(-50%, -50%) scale(0);
    border-radius: 50%;
    pointer-events: none;
  }
  &:active:before {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
    transition: transform 0.6s, opacity 1s;
  }
`

const selected = css`
  background-color: rgba(215, 196, 187, 0.2);
`

const notSelected = css`
  background-color: transparent;
`

export function Button(p: WithClass & {
  tool: Tool
  current: Tool
  icon?: JSX.Element
}) {
  const handle = () => emitToolUpdated(p.tool)

  return (
    <button
      onClick={handle}
      class={[
        baseStyle,
        p.tool === p.current ? selected : notSelected,
        p.class
      ].join(' ')}
    >
      {p.icon}
    </button>
  )
}