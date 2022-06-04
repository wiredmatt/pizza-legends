import { SpriteConfig } from '@pl-types'
import GameObject from './gameObject'

class Sprite {
  isLoaded = false
  isShadowLoaded = false
  image: HTMLImageElement
  shadow?: HTMLImageElement
  gameObject: GameObject
  animations: object
  currentAnimation: string
  currentAnimationFrame: number

  constructor(config: SpriteConfig) {
    this.image = new Image()
    this.image.src = config.src
    this.image.onload = () => {
      this.isLoaded = true
    }

    if (config.shadow) {
      this.shadow = new Image()
      this.shadow.src = config.shadow
      this.shadow.onload = () => {
        this.isShadowLoaded = true
      }
    }

    this.animations = config.animations || {
      idleDown: [[0, 0]],
    }
    this.currentAnimation = config.currentAnimation || 'idleDown'
    this.currentAnimationFrame =
      config.currentAnimationFrame || 0
    this.gameObject = config.gameObject
  }

  draw(ctx?: CanvasRenderingContext2D | null) {
    const x = this.gameObject.x * 16 - 8
    const y = this.gameObject.y * 16 - 18
    console.log('drawing', this.shadow)

    this.shadow && ctx?.drawImage(this.shadow, x, y)

    this.isLoaded &&
      ctx?.drawImage(this.image, 0, 0, 32, 32, x, y, 32, 32)
  }
}

export default Sprite
