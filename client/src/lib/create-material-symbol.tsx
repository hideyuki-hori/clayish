import { css } from 'solid-styled-components'
import { MaterialSymbols, Props } from '~/models/material-symbols'
import { WithClass } from '~/models/with-class'

export function createMaterialSymbol<T extends MaterialSymbols>(name: T, defaults: Props) {
  return (p: Partial<Props> & WithClass) => (
    <span class={'material-symbols-outlined' + ' ' + (p.class || '') + ' ' + css`
      font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    `}>
      {name}
    </span>
  )
}

export function defaults(): Props {
  return {
    FILL: 0,
    wght: 400,
    GRAD: 0,
    opsz: 24,
  }
}