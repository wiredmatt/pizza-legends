import { GameMapConfig } from '@pl-types'
import GameObject from './gameObject'
import utils from './utils'

class GameMap {
  gameObjects: Map<string, GameObject>
  lowerImage = new Image()
  upperImage = new Image()

  constructor(config: GameMapConfig) {
    this.gameObjects = config.gameObjects
    this.lowerImage.src = config.lowerSrc
    this.upperImage.src = config.upperSrc
  }

  drawLowerImage(
    ctx?: CanvasRenderingContext2D | null,
    cameraPerson?: GameObject
  ) {
    ctx?.drawImage(
      this.lowerImage,
      (cameraPerson && utils.withGrid(10.5) - cameraPerson.x) ||
        0,
      (cameraPerson && utils.withGrid(6) - cameraPerson.y) || 0
    )
  }

  drawUpperImage(
    ctx?: CanvasRenderingContext2D | null,
    cameraPerson?: GameObject
  ) {
    ctx?.drawImage(
      this.upperImage,
      (cameraPerson && utils.withGrid(10.5) - cameraPerson.x) ||
        0,
      (cameraPerson && utils.withGrid(6) - cameraPerson.y) || 0
    )
  }
}

export default GameMap
