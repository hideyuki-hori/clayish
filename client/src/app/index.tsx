import { Canvas } from '~/features/canvas'
import { Header } from '~/features/header'
import { Footer } from '~/features/footer'
import { css } from 'solid-styled-components'


export function App() {
  return (
      <main class={css`
        width: 100svw;
        height: 100svh;
        overflow: hidden;
      `}>
        <Header />
        <Footer />
        <Canvas />
      </main>
  )
}
