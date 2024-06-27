export class ColorClass {
  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
  ) { }

  static fromString(code: string) {
    const [r, g, b] = hexToRgb(code)!
    return new ColorClass(r, g, b)
  }

  get array() {
    return [this.r, this.g, this.b]
  }

  get hex() {
    return (this.r << 16) + (this.g << 8) + this.b
  }

  get hexString() {
    return this
      .array
      .map(n => n.toString(16).padStart(2, '0'))
      .reduce((code, hex) => `${code}${hex}`, '#')
  }

  get rgb() {
    return `rgb(${this.array.join(', ')})`
  }

  rgba(a: number) {
    return `rgba(${this.array.join(', ')}, ${a})`
  }
}

export type Color = InstanceType<typeof ColorClass>
export const white = new ColorClass(255, 244, 232)
export const black = new ColorClass(11, 16, 19)
export const gray = new ColorClass(158, 122, 122)
export const red = new ColorClass(247, 0, 132)
export const blue = new ColorClass(37, 0, 247)
export const green = new ColorClass(34, 255, 30)
export const yellow = new ColorClass(255, 255, 30)
export const purple = new ColorClass(173, 0, 247)

function hexToRgb(hex: string): [number, number, number] | null {
  // 短縮形（#RGB）か通常形（#RRGGBB）かをチェック
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_, r, g, b) => {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ]
  }
  return null
}