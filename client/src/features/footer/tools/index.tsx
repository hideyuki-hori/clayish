import { Tool } from '~/models/tool'
import { Button } from './button'
import { Icon360, IconStat2, IconStatMinus2 } from './icons'
import { toolUpdated$ } from '../$'
import { createSignal, onMount } from 'solid-js'
import { css } from 'solid-styled-components'

export function Tools() {
  const [current, setCurrent] = createSignal<Tool>('rotate')

  onMount(() => {
    const  subscriber = toolUpdated$.subscribe(tool => setCurrent(tool))
    return () => subscriber.unsubscribe()
  })

  return (
    <>
      <Button
        tool='rotate'
        current={current()}
        icon={<Icon360 class={css`
          color: #D7C4BB;
        `} />}
      />
      <Button
        tool='push'
        current={current()}
        icon={<IconStat2 class={css`
          color: #D7C4BB;
        `} />}
      />
      <Button
        tool='pull'
        current={current()}
        icon={<IconStatMinus2 class={css`
          color: #D7C4BB;
        `} />}
      />
    </>
  )
}