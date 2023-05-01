import {
  Behaviour,
  DirectionUpdate,
  GameObjectConfig,
  GameObjectState
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

  startBehaviour(state: GameObjectState, behaviour: Behaviour) {
    if (!behaviour.direction) throw Error('missing direction')
    this.direction = behaviour.direction

    const taken = state.map?.isSpaceTaken(
      this.x,
      this.y,
      this.direction
    )

    switch (behaviour.type) {
      case 'walk':
        if (taken) {
          behaviour.retry &&
            setTimeout(() => {
              this.startBehaviour(state, behaviour)
            }, 2000)
          return
        }

        state.map?.moveWall(this.x, this.y, this.direction)

        this.movingProgressRemaining = 16
        this.updateSprite()

        return
      case 'stand':
        this.isStanding = true

        setTimeout(() => {
          utils.emitEvent('personStandingComplete', {
            who: this.id
          })
          this.isStanding = false
        }, behaviour.time)

        return

      default:
        break
    }
  }

  update(state: GameObjectState): void {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition()
    } else {
      if (
        !state.map?.isCutscenePlaying &&
        this.isPlayerControlled &&
        state.direction
      ) {
        this.startBehaviour(state, {
          type: 'walk',
          direction: state.direction
        })
      }
      this.updateSprite()
    }
  }

  updatePosition() {
    const [property, change] =
      this.directionUpdate[this.direction]

    this[property] += change
    this.movingProgressRemaining -= 1

    if (this.movingProgressRemaining === 0) {
      utils.emitEvent('personWalkingComplete', {
        who: this.id
      })
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(
        `walk${utils.capitalize(this.direction)}`
      )
      return
    }

    this.sprite.setAnimation(
      `idle${utils.capitalize(this.direction)}`
    )
  }
}

export default Person
