import { lastValueFrom, startWith, take, withLatestFrom } from 'rxjs'
import { dragging$, mounted$ } from '~/features/canvas/$'
import { Renderer, RendererType } from '~/features/renderer'
import { loop$, emitResized, resized$ } from '~/features/browser/$'
import { Color, ColorClass, red } from '~/models/colors'
import { brushSizeUpdated$, colorUpdated$, toolUpdated$ } from '~/features/footer/$'
import { Tool } from '~/models/tool'

export async function flow() {
  const ws = new WebSocket(
    // `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`
    'http://localhost:50461/ws'
  )
  setInterval(() => ws.readyState === 1 && ws.send('ping'), 20000)

  ws.addEventListener('message', (event) => {
    try {
      var json = JSON.parse(event.data)
    } catch {
      return
    }
    if (json.tool === 'pull') {
      renderer.pull({
        phase: json.phase,
        x: json.x,
        y: json.y,
        brushSize: json.brushSize,
        color: ColorClass.fromString(json.color),
      })
    } else if (json.tool === 'push') {
      renderer.push({
        phase: json.phase,
        x: json.x,
        y: json.y,
        brushSize: json.brushSize,
        color: ColorClass.fromString(json.color),
      })
    }
  })

  window.addEventListener('res', () => emitResized({ width: innerWidth, height: innerHeight }))

  const canvas = await lastValueFrom(mounted$.pipe(take(1)))

  const renderer = new Renderer(canvas) as RendererType
  resized$.subscribe(({ width, height }) => renderer.resize(width, height))
  renderer.resize(innerWidth, innerHeight)
  loop$.subscribe(() => renderer.render())
  dragging$
    .pipe(
      withLatestFrom(toolUpdated$.pipe(startWith<Tool>('rotate'))),
      withLatestFrom(colorUpdated$.pipe(startWith<Color>(red))),
      withLatestFrom(brushSizeUpdated$.pipe(startWith<number>(1))),
    )
    .subscribe(([[[interaction, tool], color], brushSize]) => {
      switch (tool) {
        case 'rotate': return renderer.rotate({
          phase: interaction.phase,
          x: interaction.event.clientX,
          y: interaction.event.clientY,
        })
        case 'push': {
          ws.send(JSON.stringify({
            tool: 'push',
            phase: interaction.phase,
            x: interaction.event.clientX,
            y: interaction.event.clientY,
            brushSize,
            color: color.hexString,
          }))
          return renderer.push({
            phase: interaction.phase,
            x: interaction.event.clientX,
            y: interaction.event.clientY,
            brushSize,
            color,
          })
        }
        case 'pull': {
          ws.send(JSON.stringify({
            tool: 'pull',
            phase: interaction.phase,
            x: interaction.event.clientX,
            y: interaction.event.clientY,
            brushSize,
            color: color.hexString,
          }))
          return renderer.pull({
            phase: interaction.phase,
            x: interaction.event.clientX,
            y: interaction.event.clientY,
            brushSize,
            color,
          })
        }
      }
    })
}
