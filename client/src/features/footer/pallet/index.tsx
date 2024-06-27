import * as c from '~/models/colors'
import { css } from "solid-styled-components"
import type { Color } from '~/models/colors'
import { emitBrushSizeUpdated, emitColorUpdated } from '../$'
import { createEffect, createSignal, onMount } from 'solid-js'

const colors: Color[] = [
  c.red,
  c.blue,
  c.green,
  c.yellow,
  c.purple,
]

export function Pallet() {
  const [isOpen, setIsOpen] = createSignal<boolean>(false)
  const [selectedColor, setSelectedColor] = createSignal<c.ColorClass>(c.red)
  const [brushSize, setBrushSize] = createSignal<number>(2) // Default brush size
  const [palletRef, setPalletRef] = createSignal<HTMLDivElement | null>(null)

  const togglePallet = (): void => {
    setIsOpen(!isOpen())
  }

  const handleColorSelect = (color: Color): void => {
    emitColorUpdated(color)
    setSelectedColor(color)
  }

  const handleBrushSizeChange = (e: Event): void => {
    const target = e.target as HTMLInputElement
    const v = Number(target.value)
    emitBrushSizeUpdated(v)
    setBrushSize(v)
  }

  const handleClickOutside = (event: MouseEvent): void => {
    const ref = palletRef()
    if (ref && !ref.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  createEffect(() => {
    if (isOpen()) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  onMount(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div ref={setPalletRef} class={css`
        position: relative;
        display: inline-block;
    `}>
      <button
        onClick={togglePallet}
        class={css`
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: solid 2px ${selectedColor().rgb};
          background-color: ${selectedColor().rgb};
          cursor: pointer;
          flex-shrink: 0;
        `}
      />
      {isOpen() && (
        <div class={css`
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.5rem;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 1rem;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
          min-width: 200px;

          &::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid rgba(255, 255, 255, 0.9);
          }
        `}>
          <div class={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 0.5rem;
          `}>
            <input
              type='range'
              min={1}
              max={4}
              value={brushSize()}
              onInput={handleBrushSizeChange}
              class={css`
                width: 100%;
                margin-bottom: 0.5rem;
              `}
            />
            <span class={css`
              font-size: 0.8rem;
              color: ${c.black.rgb};
            `}>
              Brush Size: {brushSize()}
            </span>
          </div>
          <div class={css`
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}>
            {colors.map((color) => (
              <button
                // key={color().hex}
                onClick={() => handleColorSelect(color)}
                class={css`
                  width: 2rem;
                  height: 2rem;
                  border-radius: 50%;
                  border: solid 2px ${color.rgb};
                  background-color: ${color.rgb};
                  cursor: pointer;
                  ${color === selectedColor() ? 'box-shadow: 0 0 0 2px white, 0 0 0 4px black;' : ''}
                `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}