import logger from '@logger'
import { SpriteConfig } from '@pl-types'
import GameObject from './gameObject'

class Sprite {
  isLoaded = false
  isShadowLoaded = false
  image: HTMLImageElement
  shadow?: HTMLImageElement
  gameObject?: GameObject
  animations?: { [key: string]: [number, number][] }
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
    this.currentAnimationFrame = 0

    this.animationFrameLimit = config.animationFrameLimit || 4
    this.animationFrameProgress = this.animationFrameLimit

    this.gameObject = config.gameObject
  }

  get frame() {
    if (
      this.animations &&
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
        animations: ${
          this.animations
            ? Object.keys(this.animations).join(',')
            : 'null'
        }`
      )

      return undefined
    }
  }

  setAnimation(key: string) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key
      this.currentAnimationFrame = 0
      this.animationFrameProgress = this.animationFrameLimit
    }
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1
      return
    }

    this.animationFrameProgress = this.animationFrameLimit

    this.currentAnimationFrame += 1

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }
  }

  draw(ctx?: CanvasRenderingContext2D | null) {
    const x = this.gameObject ? this.gameObject.x - 8 : 0
    const y = this.gameObject ? this.gameObject.y - 18 : 0

    this.shadow &&
      this.isShadowLoaded &&
      ctx?.drawImage(this.shadow, x, y)

    let [frameX, frameY] = [0, 0]

    if (this.frame) {
      ;[frameX, frameY] = this.frame
    }

    this.isLoaded &&
      ctx?.drawImage(
        this.image,
        frameX * 32,
        frameY * 32,
        32,
        32,
        x,
        y,
        32,
        32
      )
    this.updateAnimationProgress()
  }
}

export default Sprite
