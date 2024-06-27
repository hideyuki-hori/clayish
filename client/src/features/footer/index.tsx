import { css } from 'solid-styled-components'
import { Tools } from './tools'
import { Pallet } from './pallet'

export function Footer() {
  return (
    <footer class={css`
      position: fixed;
      bottom: 1.5rem;
      z-index: 10;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    `}>
      <div class={css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      `}>
        <Tools />
      </div>
      <div class={css`
        margin: 0 1rem;
        padding: 0 1rem;
        width: 1px;
        border-left: solid 1px rgba(215, 196, 187, 0.2);
      `}>
        <Pallet />
      </div>
    </footer>
  )
}