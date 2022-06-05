import type {
  Direction,
  DirectionUpdate,
  GameObjectConfig
} from '@pl-types'
import Sprite from './sprite'

class GameObject {
  x: number
  y: number
  direction: Direction
  sprite: Sprite

  directionUpdate: DirectionUpdate = {
    up: ['y', -1],
    down: ['y', 1],
    left: ['x', -1],
    right: ['x', 1]
  }

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
  }

  update?(state: { direction: Direction }): void
}

export default GameObject
