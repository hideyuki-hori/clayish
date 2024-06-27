import { Observable, Subject } from 'rxjs'

export const loop$ = new Observable<{
  fps: number
  delta: number
}>(observer => {
  let lastFrameTime = performance.now()

  const tick = () => {
    const now = performance.now()
    const delta = now - lastFrameTime
    const fps = 1000 / delta
    observer.next({ fps, delta })

    lastFrameTime = now
    requestAnimationFrame(tick)
  }

  tick()
})

export type ResizedPayload = {
  width: number
  height: number
}
const resized = new Subject<ResizedPayload>()
export const resized$ = resized.asObservable()
export const emitResized = (payload: ResizedPayload) => resized.next(payload)