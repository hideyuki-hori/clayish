import { Hono } from 'hono'
import type { DurableObjectNamespace } from '@cloudflare/workers-types'
import { serveStatic } from 'hono/cloudflare-workers'

type Env = {
  Bindings: {
    WEBSOCKET: DurableObjectNamespace
  }
}

export class WebSocketConnection implements DurableObject {
  private readonly sessions = new Set<WebSocket>()

  async fetch(request: Request) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 })
    }

    const pair = new WebSocketPair()
    const [client, server] = Object.values(pair)

    await this.handleSession(server as WebSocket)

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  }

  private async handleSession(webSocket: WebSocket): Promise<void> {
    (webSocket as any).accept()
    this.sessions.add(webSocket)

    webSocket.addEventListener('message', async (event: MessageEvent) => {
      this.sessions.forEach((session) => session.readyState === WebSocket.OPEN && session.send(event.data))
    })

    webSocket.addEventListener('close', async (event: CloseEvent) => {
      this.sessions.delete(webSocket)
    })
  }
}


const app = new Hono<Env>()
  .use('/*', serveStatic({ root: './', manifest: {} }))
  // @ts-ignore
  .get('/ws', c => {
    const upgradeHeader = c.req.header('Upgrade')
    if (upgradeHeader !== 'websocket') {
      return c.text('Expected WebSocket', 426)
    }

    const id = c.env.WEBSOCKET.idFromName('websocket')
    const connection = c.env.WEBSOCKET.get(id)
    // @ts-ignore
    return connection.fetch(c.req.raw)
  })


export default app