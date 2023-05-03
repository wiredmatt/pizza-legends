import {
  Behaviour,
  CutsceneSpaces,
  Direction,
  GameMapConfig
} from '@pl-types'
import GameEvent from './game-event'
import GameObject from './game-object'
import Overworld from './overworld'
import Person from './person'
import utils from './utils'

class GameMap {
  gameObjects: Map<string, GameObject | Person>
  lowerImage = new Image()
  upperImage = new Image()
  walls?: Record<string, boolean>
  isCutscenePlaying = false
  cutsceneSpaces: CutsceneSpaces
  overworld: Overworld | null
  isPaused: boolean = false

  constructor(config: GameMapConfig) {
    this.gameObjects = config.gameObjects
    this.walls = config.walls
    this.lowerImage.src = config.lowerSrc
    this.upperImage.src = config.upperSrc
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.overworld = null
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

      const result = await eventHandler.init()

      if (event.type === 'battle' && result !== 'player') {
        console.log('You lost the battle')
        break
      }
    }

    this.isCutscenePlaying = false

    this.gameObjects.forEach(obj => {
      obj.doBehaviourEvent(this)
    })
  }

  checkForActionCutscene() {
    const hero = this.gameObjects.get('hero')
    let match

    if (hero) {
      const nextCoords = utils.nextPosition(
        hero.x,
        hero.y,
        hero.direction
      )

      match = [...this.gameObjects.values()].find(gameObject => {
        return (
          `${gameObject.x},${gameObject.y}` ===
          `${nextCoords.x},${nextCoords.y}`
        )
      })

      if (
        !this.isCutscenePlaying &&
        match &&
        match.talking.length
      ) {
        const relevantScenario = match.talking.find(scenario =>
          (scenario?.requires || []).every(sf => {
            return playerState?.storyFlags[sf]
          })
        )

        relevantScenario &&
          this.startCutscene(relevantScenario.events)
      }
    }

    return match
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects.get('hero')

    if (hero) {
      const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]

      if (!this.isCutscenePlaying && match && match.length) {
        this.startCutscene(match[0].events)
      }
    }
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
