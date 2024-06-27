import type { Color } from './colors'
import { InteractionPhase } from './interaction-phase'

export type Props = {
  phase: InteractionPhase
  x: number
  y: number
  brushSize: number
  color: Color
}

export interface IPuller {
  pull(p: Props): void
}