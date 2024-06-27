import { css } from 'solid-styled-components'
import { ExternalLink } from './external-link'
import { DevTo, GitHub, Zenn } from './icons'
import { black, white } from '~/models/colors'

export function Header() {
  return (
    <header class={css`
      margin-top: 1rem;
      z-index: 10;
      width: 100%;
      position: fixed;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;
      color: ${white.rgb};
    `}>
      <h1 class={css`
        font-size: 2rem;
        letter-spacing: 0.3rem;
        font-weight: bold;
      `}>
        clayish
      </h1>
      <span>-</span>
      <ExternalLink href=''>
        <GitHub class={css`
          width: 22px;
          height: 22px;
        `} />
      </ExternalLink>
      <ExternalLink href=''>
        <Zenn />
      </ExternalLink>
      <ExternalLink href=''>
        <DevTo />
      </ExternalLink>
    </header>
  )
}