import type {
  Direction,
  GameObjectConfig,
  GameObjectState
} from '@pl-types'
import GameMap from './gameMap'
import Sprite from './sprite'

class GameObject {
  x: number
  y: number
  direction: Direction
  sprite: Sprite
  isMounted = false

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

  mount(map: GameMap) {
    this.isMounted = true
    map.addWall(this.x, this.y)
  }

  update?(state: GameObjectState): void
}

export default GameObject
