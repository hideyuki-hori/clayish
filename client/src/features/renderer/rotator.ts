import { Quaternion, Vector3 } from 'three'
import { Constructor } from '~/models/constructor'
import { IRotator, Props } from '~/models/i-rotator'
import { IBaseRenderer } from '~/models/i-base-renderer'

export function Rotator<T extends Constructor<IBaseRenderer>>(Base: T) {
  return class extends Base implements IRotator {
    private lastX: number = 0
    private lastY: number = 0
    private isRotating: boolean = false
    private rotationSpeed = 0.01

    rotate({ phase, x, y }: Props): void {
      switch (phase) {
        case 'pressed':
          return this.atPressed(x, y)
        case 'dragging':
          return this.atdragging(x, y)
        case 'released':
          return this.atReleased()
      }
    }

    private atPressed(x: number, y: number): void {
      this.isRotating = true
      this.lastX = x
      this.lastY = y
    }

    private atdragging(x: number, y: number): void {
      if (!this.isRotating) {
        this.isRotating = true
        this.lastX = x
        this.lastY = y
        return
      }

      const deltaX = x - this.lastX
      const deltaY = y - this.lastY

      this.applyRotation(deltaX, deltaY)

      this.lastX = x
      this.lastY = y
    }

    private atReleased(): void {
      this.isRotating = false
    }

    private applyRotation(deltaX: number, deltaY: number): void {
      const quaternionX = new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        -deltaX * this.rotationSpeed
      )
      const quaternionY = new Quaternion().setFromAxisAngle(
        new Vector3(1, 0, 0),
        -deltaY * this.rotationSpeed
      )

      this.mesh.quaternion.multiplyQuaternions(quaternionX, this.mesh.quaternion)
      this.mesh.quaternion.multiplyQuaternions(quaternionY, this.mesh.quaternion)
    }
  }
}
