import { css } from 'solid-styled-components'
import { white } from '~/models/colors'
import { WithChildren } from '~/models/with-children'
import { WithClass } from '~/models/with-class'

export type Props = Pick<HTMLAnchorElement, 'href'> & WithClass & WithChildren

export function ExternalLink(p: Props) {
  return (
    <a
      class={(p.class || '') + ' ' + css`
        width: 20px;
        height: 20px;
        color: ${white.rgb};
        &:hover {
          color: #999999;
        }
      `}
      href={p.href}
      target='_blank'
      rel='noopener noreferrer'
    >
      {p.children}
    </a>
  )
}