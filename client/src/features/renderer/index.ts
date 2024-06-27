import { IRotator } from '~/models/i-rotator'
import { BaseRenderer } from './base-renderer'
import { Puller } from './puller'
import { Pusher } from './pusher'
import { Rotator } from './rotator'
import { IPusher } from '~/models/i-pusher'
import { IPuller } from '~/models/i-puller'
import { IBaseRenderer } from '~/models/i-base-renderer'

const RotatedRenderer = Rotator(BaseRenderer)
type RotatedRendererType = typeof RotatedRenderer & IRotator
const PushedRotatedRenderer = Pusher(RotatedRenderer)
type PushedRotatedRendererType = typeof PushedRotatedRenderer & IPusher
const PulledPushedRotatedRenderer = Puller(PushedRotatedRenderer)
type PulledPushedRotatedRendererType = typeof PulledPushedRotatedRenderer & IPuller
export type RendererType = PulledPushedRotatedRendererType & IBaseRenderer & IPuller & IPusher & IRotator
export const Renderer = PulledPushedRotatedRenderer as RendererType
