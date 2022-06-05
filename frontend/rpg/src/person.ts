import {
  Direction,
  DirectionUpdate,
  GameObjectConfig
} from '@pl-types'
import GameObject from './gameObject'
import utils from './utils'

class Person extends GameObject {
  movingProgressRemaining = 0
  isPlayerControlled = false

  directionUpdate: DirectionUpdate = {
    up: ['y', -1],
    down: ['y', 1],
    left: ['x', -1],
    right: ['x', 1]
  }

  constructor(config: GameObjectConfig) {
    super(config)
    this.isPlayerControlled = config.isPlayerControlled || false
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] =
        this.directionUpdate[this.direction]

      this[property] += change
      this.movingProgressRemaining -= 2
    }
  }

  update(state: { direction: Direction }): void {
    this.updatePosition()
    this.updateSprite(state)
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state.direction
    ) {
      this.direction = state.direction
      this.movingProgressRemaining = 16
    }
  }

  updateSprite(state: { direction: Direction }) {
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      !state.direction
    ) {
      this.sprite.setAnimation(
        `idle${utils.capitalize(this.direction)}`
      )
      return
    }

    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(
        `walk${utils.capitalize(this.direction)}`
      )
      return
    }
  }
}

export default Person
