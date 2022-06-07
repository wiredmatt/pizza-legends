import type {
  Behaviour,
  Direction,
  GameObjectConfig,
  GameObjectState
} from '@pl-types'
import GameEvent from './GameEvent'
import GameMap from './gameMap'
import Sprite from './sprite'

class GameObject {
  id?: string
  x: number
  y: number
  direction: Direction
  sprite: Sprite
  isMounted = false
  behaviourLoop: Behaviour[]
  behaviourLoopIndex = 0
  isStanding = false

  constructor(config: GameObjectConfig) {
    this.x = config.x
    this.y = config.y
    this.direction = config.direction || 'down'
    this.sprite = new Sprite({
      src: config.src || '/images/characters/people/hero.png',
      shadow: config.shadow,
      gameObject: this,
      animations: config.animations
    })
    this.behaviourLoop = config.behaviourLoop || []
  }

  mount(map: GameMap) {
    this.isMounted = true
    map.addWall(this.x, this.y)

    if (this.behaviourLoop.length) {
      setTimeout(() => {
        this.doBehaviourEvent(map)
      }, 10)
    }
  }

  async doBehaviourEvent(map: GameMap) {
    if (
      map.isCutscenePlaying ||
      this.behaviourLoop.length === 0 ||
      this.isStanding
    ) {
      return
    }

    const event = this.behaviourLoop[this.behaviourLoopIndex]

    event.who = this.id

    const evHandler = new GameEvent({
      map,
      event
    })

    await evHandler.init()

    this.behaviourLoopIndex += 1

    if (this.behaviourLoopIndex === this.behaviourLoop.length) {
      this.behaviourLoopIndex = 0
    }

    this.doBehaviourEvent(map)
  }

  update?(state: GameObjectState): void
}

export default GameObject
