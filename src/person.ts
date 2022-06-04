import { Direction, GameObjectConfig } from '@pl-types'
import GameObject from './gameObject'

class Person extends GameObject {
  movingProgressRemaining: number
  isPlayerControlled = false

  constructor(config: GameObjectConfig) {
    super(config)
    this.movingProgressRemaining = 0
    this.isPlayerControlled = config.isPlayerControlled || false
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] =
        this.directionUpdate[this.direction]

      this[property] += change
      this.movingProgressRemaining -= 1
    }
  }

  update(state: { direction: Direction }): void {
    this.updatePosition()

    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state.direction
    ) {
      this.direction = state.direction
      this.movingProgressRemaining = 16
    }
  }
}

export default Person
