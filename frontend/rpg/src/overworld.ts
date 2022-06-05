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

  constructor(config: OwConfig) {
    this.element = config.element
    this.canvas = this.element?.querySelector('.game-canvas')
    this.ctx = this.canvas?.getContext('2d')
    this.map = config.map
  }

  startGameLoop() {
    const step = () => {
      this.ctx?.clearRect(
        0,
        0,
        this.canvas?.width || 0,
        this.canvas?.height || 0
      )

      this.map?.drawLowerImage(this.ctx)

      this.map?.gameObjects.forEach((gameObject) => {
        if (gameObject.update) {
          gameObject.update({
            direction: this.directionInput?.direction
          })
        }
        gameObject.sprite.draw(this.ctx)
      })

      this.map?.drawUpperImage(this.ctx)

      requestAnimationFrame(() => {
        step()
      })
    }

    step()
  }

  init() {
    this.map = new Map(maps.DemoRoom)
    this.directionInput.init()
    this.startGameLoop()
  }
}

export default Overworld
