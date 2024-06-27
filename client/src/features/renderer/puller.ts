import {
  Vector2,
  Vector3,
  Raycaster,
  BufferAttribute,
  Color as ThreeColor,
  DynamicDrawUsage,
  Matrix4,
} from 'three'
import { Constructor } from '~/models/constructor'
import { Color } from '~/models/colors'
import { IPuller, Props } from '~/models/i-puller'
import { IBaseRenderer } from '~/models/i-base-renderer'

export function Puller<T extends Constructor<IBaseRenderer>>(Base: T) {
  return class extends Base implements IPuller {
    private readonly raycaster = new Raycaster()
    private readonly deformationAttribute: BufferAttribute
    private readonly colorAttribute: BufferAttribute
    private lastPoint: Vector3 | null = null
    private accumulatedDeformation: Float32Array

    constructor(...args: any[]) {
      super(...args)

      this.deformationAttribute = new BufferAttribute(new Float32Array(this.geometry.attributes.position.count), 1)
      this.geometry.setAttribute('deformation', this.deformationAttribute)

      this.colorAttribute = new BufferAttribute(new Float32Array(this.geometry.attributes.position.count * 3), 3)
      this.colorAttribute.setUsage(DynamicDrawUsage)
      this.geometry.setAttribute('color', this.colorAttribute)

      this.accumulatedDeformation = new Float32Array(this.geometry.attributes.position.count * 3)
    }

    pull({ phase, x, y, brushSize, color }: Props): void {
      const point = new Vector2(
        (x / this.width) * 2 - 1,
        -(y / this.height) * 2 + 1
      )

      if (phase === 'dragging') {
        this.applySmoothing(point, brushSize, color)
      } else {
        this.lastPoint = null
      }
    }

    private applySmoothing(point: Vector2, brushSize: number, color: Color): void {
      this.raycaster.setFromCamera(point, this.camera)

      const worldMatrix = this.mesh.matrixWorld
      const inverseWorldMatrix = new Matrix4().copy(worldMatrix).invert()

      const localRayOrigin = this.raycaster.ray.origin.clone().applyMatrix4(inverseWorldMatrix)
      const localRayDirection = this.raycaster.ray.direction.clone().transformDirection(inverseWorldMatrix)

      const localRaycaster = new Raycaster(localRayOrigin, localRayDirection)
      const intersects = localRaycaster.intersectObject(this.mesh)

      if (intersects.length > 0) {
        const currentPoint = intersects[0].point.clone().applyMatrix4(worldMatrix)
        const normal = intersects[0].face?.normal.clone().transformDirection(worldMatrix) || new Vector3(0, 1, 0)
        const positions = this.geometry.attributes.position
        const deformations = this.geometry.attributes.deformation
        const colors = this.geometry.attributes.color

        // 平均高さを計算
        let averageHeight = 0
        let affectedVerticesCount = 0

        for (let i = 0; i < positions.count; i++) {
          const vertex = new Vector3().fromBufferAttribute(positions, i)
          const worldVertex = vertex.clone().applyMatrix4(worldMatrix)
          const distance = currentPoint.distanceTo(worldVertex)
          const maxDistance = brushSize * 0.5

          if (distance < maxDistance) {
            averageHeight += worldVertex.dot(normal)
            affectedVerticesCount++
          }
        }

        if (affectedVerticesCount > 0) {
          averageHeight /= affectedVerticesCount

          for (let i = 0; i < positions.count; i++) {
            const vertex = new Vector3().fromBufferAttribute(positions, i)
            const worldVertex = vertex.clone().applyMatrix4(worldMatrix)
            const distance = currentPoint.distanceTo(worldVertex)
            const maxDistance = brushSize * 0.5

            if (distance < maxDistance) {
              const influence = Math.pow(1 - distance / maxDistance, 2)
              const smoothingStrength = 0.1 * brushSize

              // 頂点の高さと平均高さの差を計算
              const heightDifference = worldVertex.dot(normal) - averageHeight

              // 平滑化ベクトルを計算
              const smoothingVector = normal.clone().multiplyScalar(-heightDifference * smoothingStrength * influence)

              // ワールド座標系での変形をローカル座標系に変換
              const localDeformation = smoothingVector.applyMatrix4(inverseWorldMatrix)

              // 累積変形を更新
              this.accumulatedDeformation[i * 3] += localDeformation.x
              this.accumulatedDeformation[i * 3 + 1] += localDeformation.y
              this.accumulatedDeformation[i * 3 + 2] += localDeformation.z

              // 累積変形を適用
              const totalDeformation = new Vector3(
                this.accumulatedDeformation[i * 3],
                this.accumulatedDeformation[i * 3 + 1],
                this.accumulatedDeformation[i * 3 + 2]
              )
              vertex.add(totalDeformation)
              positions.setXYZ(i, vertex.x, vertex.y, vertex.z)

              // 変形度合いを更新
              const currentDeformation = deformations.getX(i)
              const newDeformationAmount = Math.min(currentDeformation + influence * 0.1, 1.0)
              deformations.setX(i, newDeformationAmount)

              // 色を更新
              const currentColor = new ThreeColor().fromBufferAttribute(colors, i)
              const threeColor = new ThreeColor(color.hex)
              const newColor = currentColor.lerp(threeColor, influence * 0.1)
              colors.setXYZ(i, newColor.r, newColor.g, newColor.b)
            }
          }

          positions.needsUpdate = true
          deformations.needsUpdate = true
          colors.needsUpdate = true
          this.geometry.computeVertexNormals()
        }

        this.lastPoint = currentPoint
      }
    }
  }
}