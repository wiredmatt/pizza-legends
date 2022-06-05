import type { Direction, GameObjectConfig } from '@pl-types'
import Sprite from './sprite'

class GameObject {
  x: number
  y: number
  direction: Direction
  sprite: Sprite

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
