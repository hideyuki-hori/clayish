import { Subject } from 'rxjs'
import type { Tool } from '~/models/tool'
import type { Color } from '~/models/colors'

const toolUpdated = new Subject<Tool>()
export const toolUpdated$ = toolUpdated.asObservable()
export const emitToolUpdated = (tool: Tool) => toolUpdated.next(tool)

const colorUpdated = new Subject<Color>()
export const colorUpdated$ = colorUpdated.asObservable()
export const emitColorUpdated = (color: Color) => colorUpdated.next(color)

const brushSizeUpdated = new Subject<number>()
export const brushSizeUpdated$ = brushSizeUpdated.asObservable()
export const emitBrushSizeUpdated = (brushSize: number) => brushSizeUpdated.next(brushSize)