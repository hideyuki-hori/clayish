import { InteractionPhase } from './interaction-phase'

export type Props = {
  phase: InteractionPhase
  x: number
  y: number
}

export interface IRotator {
  rotate(p: Props): void
}