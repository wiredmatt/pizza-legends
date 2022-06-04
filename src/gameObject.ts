import { GameObjectConfig } from '@pl-types'
import Sprite from './sprite'

class GameObject {
  x: number
  y: number
  sprite: Sprite

  constructor(config: GameObjectConfig) {
    this.x = config.x
    this.y = config.y
    this.sprite = new Sprite({
      src: config.src || '/images/characters/people/hero.png',
      shadow: config.shadow,
      gameObject: this,
    })
  }
}

export default GameObject
