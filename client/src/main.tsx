/* @refresh reload */
import { render } from 'solid-js/web'
import { App } from './app'
import { flow } from './app/flow'
import './index.css'

const root = document.getElementById('clayish')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

flow()

render(() => <App />, root!)
