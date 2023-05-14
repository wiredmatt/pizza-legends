import type {
  Behaviour,
  Direction,
  GameObjectConfig,
  GameObjectState,
  Talking
} from '@pl-types'
import { Pizzas } from './content/pizzas'
import GameEvent from './game-event'
import GameMap from './game-map'
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
  talking: Talking
  pizzas?: (keyof typeof Pizzas)[] = []

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
    this.talking = config.talking || []
    this.pizzas = config.pizzas || []
  }

  get position() {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction
    }
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
