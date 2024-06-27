import { Mesh, PerspectiveCamera, ShaderMaterial, SphereGeometry } from 'three'

export interface IBaseRenderer {
  readonly camera: PerspectiveCamera
  readonly geometry: SphereGeometry
  readonly material: ShaderMaterial
  readonly mesh: Mesh
  readonly width: number
  readonly height: number
  render(): void
  resize(x: number, y: number): void
}