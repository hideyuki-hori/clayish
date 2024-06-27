import { emitLeaved, emitMounted, emitMoving, emitPressed, emitReleased } from './$'
import { createSignal, onMount } from 'solid-js'

export function Canvas() {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>()

  onMount(() => {
    const ref = canvas()
    !!ref && emitMounted(ref)
  })

  return (
    <canvas
      ref={setCanvas}
      onMouseDown={emitPressed}
      onMouseMove={emitMoving}
      onMouseUp={emitReleased}
      onMouseLeave={emitLeaved}
    />
  )
}
