import { MapConfig } from '@pl-types'
import GameObject from './gameObject'

class Map {
  gameObjects: GameObject[]
  lowerImage = new Image()
  upperImage = new Image()

  constructor(config: MapConfig) {
    this.gameObjects = config.gameObjects
    this.lowerImage.src = config.lowerSrc
    this.upperImage.src = config.upperSrc
  }

  drawLowerImage(ctx?: CanvasRenderingContext2D | null) {
    ctx?.drawImage(this.lowerImage, 0, 0)
  }

  drawUpperImage(ctx?: CanvasRenderingContext2D | null) {
    ctx?.drawImage(this.upperImage, 0, 0)
  }
}

export default Map
