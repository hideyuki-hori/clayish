import { Subject, scan, switchMap, takeUntil, withLatestFrom, of } from 'rxjs'
import { map, mergeWith } from 'rxjs/operators'
import { loop$ } from '~/features/browser/$'

const mounted = new Subject<HTMLCanvasElement>()
export const mounted$ = mounted.asObservable()
export const emitMounted = (canvas: HTMLCanvasElement) => mounted.next(canvas)

const pressed = new Subject<MouseEvent>()
export const pressed$ = pressed.asObservable()
export const emitPressed = (event: MouseEvent) => pressed.next(event)

const moving = new Subject<MouseEvent>()
export const moving$ = moving.asObservable()
export const emitMoving = (event: MouseEvent) => moving.next(event)

const released = new Subject<MouseEvent>()
export const released$ = released.asObservable()
export const emitReleased = (event: MouseEvent) => released.next(event)

const leaved = new Subject<MouseEvent>()
export const leaved$ = leaved.asObservable()
export const emitLeaved = (event: MouseEvent) => leaved.next(event)

export type InteractionPhase = 'pressed' | 'dragging' | 'released'

export const dragging$ = pressed$.pipe(
  switchMap(pressed =>
    of({ phase: 'pressed' as InteractionPhase, event: pressed }).pipe(
      mergeWith(
        loop$.pipe(
          withLatestFrom(moving$),
          scan((accumulator, [{ fps, delta }, latest]) => ({
            phase: 'dragging' as InteractionPhase,
            event: latest,
            latest,
            fps,
            delta,
            duration: accumulator.duration + delta,
          }), {
            phase: 'dragging' as InteractionPhase,
            event: pressed,
            fps: 0,
            delta: 0,
            duration: 0,
          }),
        ),
        released$.pipe(map(event => ({ phase: 'released' as InteractionPhase, event }))),
        leaved$.pipe(map(event => ({ phase: 'released' as InteractionPhase, event }))),
      ),
      takeUntil(released$),
      takeUntil(leaved$),
    )
  )
)
