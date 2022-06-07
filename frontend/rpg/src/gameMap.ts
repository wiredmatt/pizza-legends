import { Behaviour, Direction, GameMapConfig } from '@pl-types'
import GameEvent from './GameEvent'
import GameObject from './gameObject'
import Person from './person'
import utils from './utils'

class GameMap {
  gameObjects: Map<string, GameObject | Person>
  lowerImage = new Image()
  upperImage = new Image()
  walls?: Record<string, boolean>
  isCutscenePlaying = false

  constructor(config: GameMapConfig) {
    this.gameObjects = config.gameObjects
    this.walls = config.walls
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

  isSpaceTaken(
    currentX: number,
    currentY: number,
    direction: Direction
  ) {
    const { x, y } = utils.nextPosition(
      currentX,
      currentY,
      direction
    )
    if (this.walls) {
      return this.walls[`${x},${y}`] || false
    } else {
      return false
    }
  }

  mountObjects() {
    this.gameObjects.forEach((value, key) => {
      value.id = key
      value.mount(this)
    })
  }

  async startCutscene(events: Behaviour[]) {
    this.isCutscenePlaying = true

    for (const event of events) {
      const eventHandler = new GameEvent({
        event,
        map: this
      })

      await eventHandler.init()
    }

    this.isCutscenePlaying = false

    this.gameObjects.forEach(value => {
      value.doBehaviourEvent(this)
    })
  }

  addWall(x: number, y: number) {
    if (this.walls) {
      this.walls[`${x},${y}`] = true
    }
  }

  removeWall(x: number, y: number) {
    if (this.walls) {
      delete this.walls[`${x},${y}`]
    }
  }

  moveWall(prevX: number, prevY: number, direction: Direction) {
    if (this.walls) {
      delete this.walls[`${prevX},${prevY}`]
      const { x, y } = utils.nextPosition(
        prevX,
        prevY,
        direction
      )

      this.addWall(x, y)
    }
  }
}

export default GameMap
