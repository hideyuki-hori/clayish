import {
  Color,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer
} from 'three'
import { white } from '~/models/colors'
import { IBaseRenderer } from '~/models/i-base-renderer'

const vertexShader = `
varying vec3 vNormal;
varying float vDeformation;
varying vec3 vColor;
attribute float deformation;
attribute vec3 color;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vDeformation = deformation;
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec3 baseColor;
varying vec3 vNormal;
varying float vDeformation;
varying vec3 vColor;

void main() {
  vec3 finalColor = mix(baseColor, vColor, vDeformation);
  gl_FragColor = vec4(finalColor, 1.0);
}
`

export class BaseRenderer implements IBaseRenderer {
  readonly geometry = new SphereGeometry(2, 64, 64)
  readonly material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      baseColor: {
        value: new Color(white.hex),
      },
    },
  })
  readonly mesh = new Mesh(this.geometry, this.material)
  readonly camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1, 1000
  )

  private readonly webGL: WebGLRenderer
  private readonly scene = new Scene()

  private _width: number = 0
  private _height: number = 0
  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  constructor(canvas: HTMLCanvasElement) {
    this.webGL = new WebGLRenderer({ canvas, alpha: true })
    this.scene.add(this.mesh)
    this.camera.position.z = 5
    this.material.needsUpdate = true
  }

  render() {
    this.webGL.render(this.scene, this.camera)
  }

  resize(width: number, height: number): void {
    this._width = width
    this._height = height
    this.webGL.setSize(width, height)
  }
}