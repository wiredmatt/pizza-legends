import { maps } from '@data'
import type { OwConfig } from '@pl-types'
import DirectionInput from './directionInput'
import Map from './map'

class Overworld {
  element: HTMLElement | null
  canvas?: HTMLCanvasElement | null
  ctx?: CanvasRenderingContext2D | null
  map?: Map | null
  directionInput = new DirectionInput()
  fps = 30
  bX = 30
  bY = 30
  mX = 30
  mY = 30
  interval = 1000 / this.fps
  lastTime = new Date().getTime()
  currentTime = 0
  delta = 0

  constructor(config: OwConfig) {
    this.element = config.element
    this.canvas = this.element?.querySelector('.game-canvas')
    this.ctx = this.canvas?.getContext('2d')
    this.map = config.map || null
  }

  update() {
    //loop over your objects and run each objects update function
    this.map?.gameObjects.forEach((gameObject) => {
      if (gameObject.update) {
        gameObject.update({
          direction: this.directionInput?.direction
        })
      }
    })
  }

  render() {
    //loop over your objects and run each objects render function
    this.map?.gameObjects.forEach((gameObject) => {
      gameObject.sprite.draw(this.ctx)
    })
  }

  gameLoop() {
    this.currentTime = new Date().getTime()
    this.delta = this.currentTime - this.lastTime
    this.update()
    requestAnimationFrame(() => this.gameLoop())

    if (this.delta > this.interval) {
      this.ctx?.clearRect(
        0,
        0,
        this.canvas?.width || 0,
        this.canvas?.height || 0
      )

      this.map?.drawLowerImage(this.ctx)

      this.render()

      this.map?.drawUpperImage(this.ctx)

      if (this.bX >= this.canvas.width || this.bX <= 0) {
        this.mX *= -1
      }
      if (this.bY >= this.canvas.height || this.bY <= 0) {
        this.mY *= -1
      }

      this.bX += this.mX
      this.bY += this.mY

      this.lastTime =
        this.currentTime - (this.delta % this.interval)
    }
  }

  init() {
    this.map = new Map(maps.DemoRoom)
    this.directionInput.init()
    this.gameLoop()
  }
}

export default Overworld
