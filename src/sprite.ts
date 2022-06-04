import logger from '@logger'
import { SpriteConfig } from '@pl-types'
import GameObject from './gameObject'

class Sprite {
  isLoaded = false
  isShadowLoaded = false
  image: HTMLImageElement
  shadow?: HTMLImageElement
  gameObject: GameObject
  animations: { [key: string]: [number, number][] }
  currentAnimation: string
  currentAnimationFrame: number
  animationFrameLimit: number
  animationFrameProgress: number

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
      idleDown: [[0, 0]]
    }
    this.currentAnimation = config.currentAnimation || 'idleDown'
    this.currentAnimationFrame =
      config.currentAnimationFrame || 0

    this.animationFrameLimit = config.animationFrameLimit || 16
    this.animationFrameProgress = this.animationFrameLimit

    this.gameObject = config.gameObject
  }

  get frame() {
    if (
      Object.keys(this.animations).includes(
        this.currentAnimation
      )
    ) {
      const animation = this.animations[this.currentAnimation]
      const frame = animation[this.currentAnimationFrame]

      return frame
    } else {
      logger.error(
        `${typeof this} - ${typeof arguments.callee.name}`,
        `currentAnimation: ${this.currentAnimation}
        animations: ${Object.keys(this.animations).join(',')}`
      )
    }
  }

  draw(ctx?: CanvasRenderingContext2D | null) {
    const x = this.gameObject.x - 8
    const y = this.gameObject.y - 18

    this.shadow && ctx?.drawImage(this.shadow, x, y)

    this.isLoaded &&
      ctx?.drawImage(this.image, 0, 0, 32, 32, x, y, 32, 32)
  }
}

export default Sprite
