import { maps } from '@data'
import type { Behaviour, OwConfig } from '@pl-types'
import { GameMaps } from 'data/maps'
import constants from './constants'
import DirectionInput from './direction-input'
import GameMap from './game-map'
import GameObject from './game-object'
import { HUD } from './hud'
import KeyPressListener from './key-press-listener'
import { Progress } from './progress'
import utils from './utils'

class Overworld {
  element: HTMLElement | null
  canvas?: HTMLCanvasElement | null
  ctx?: CanvasRenderingContext2D | null
  map?: GameMap | null
  directionInput = new DirectionInput()
  fps = 60
  bX = 60
  bY = 60
  mX = 60
  mY = 60
  interval = 1000 / this.fps
  lastTime = new Date().getTime()
  currentTime = 0
  delta = 0
  hud = new HUD()
  progress: Progress | null = null

  constructor(config: OwConfig) {
    this.element = config.element
    this.canvas = this.element?.querySelector('.game-canvas')
    this.ctx = this.canvas?.getContext('2d')
    this.map = config.map || null
  }

  update() {
    //loop over your objects and run each objects update function
    if (this.map?.gameObjects) {
      this.map.gameObjects.forEach(value => {
        if (value.update) {
          value.update({
            direction: this.directionInput?.direction,
            map: this.map
          })
        }
      })
    }
  }

  get sortedGameObjects() {
    if (this.map) {
      return utils.sortMap(this.map.gameObjects, 'y')
    } else {
      return []
    }
  }

  render(cameraPerson?: GameObject) {
    //loop over your objects and run each objects render function
    if (this.map?.gameObjects) {
      this.sortedGameObjects.forEach(value => {
        value.sprite.draw(this.ctx, cameraPerson)
      })
    }
  }

  get cameraPerson() {
    return this.map?.gameObjects.get('hero')
  }

  gameLoop() {
    this.currentTime = new Date().getTime()
    this.delta = this.currentTime - this.lastTime
    this.update()

    if (this.canvas && this.delta > this.interval) {
      this.ctx?.clearRect(
        0,
        0,
        this.canvas.width || 0,
        this.canvas.height || 0
      )

      this.map?.drawLowerImage(this.ctx, this.cameraPerson)

      this.render(this.cameraPerson)

      this.map?.drawUpperImage(this.ctx, this.cameraPerson)

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

    if (!this.map?.isPaused) {
      requestAnimationFrame(() => this.gameLoop())
    }
  }

  bindActionInput() {
    new KeyPressListener('Enter', () => {
      this.map?.checkForActionCutscene()
    })

    new KeyPressListener('Escape', () => {
      if (!this.map?.isCutscenePlaying) {
        this.map?.startCutscene([
          {
            type: 'pause'
          }
        ])
      }
    })
  }

  bindHeroPosition() {
    document.addEventListener('personWalkingComplete', e => {
      if (e.detail.who === constants.HERO) {
        this.map?.checkForFootstepCutscene()
      }
    })
  }

  changeMap(
    mapId?: GameMaps,
    cfg?: Pick<Behaviour, 'direction' | 'x' | 'y'>
  ) {
    if (!mapId) {
      return
    }

    this.map = new GameMap(mapId, maps[mapId])
    this.map.overworld = this
    this.map.mountObjects()

    if (cfg) {
      const hero = this.map.gameObjects.get(constants.HERO)
      if (hero) {
        // this.map.removeWall(hero.x, hero.y)

        hero.x = cfg.x || 0
        hero.y = cfg.y || 0
        hero.direction = cfg.direction || 'right'

        // this.map.addWall(hero.x, hero.y)
      }

      this.progress!.config = {
        ...this.progress!.config,
        ...cfg,
        mapId
      }
    }
  }

  init() {
    this.changeMap('DemoRoom')

    this.progress = new Progress(
      {
        mapId: this.map?.id || 'DemoRoom',
        direction: 'right',
        x: 0,
        y: 0,
        saveFileKey: 'test'
      },
      () => {
        return this.cameraPerson
      }
    ) // initial state

    const wasSavedData = this.progress.load() // if there was a save file, load it

    if (wasSavedData) {
      this.changeMap(
        this.progress.config.mapId,
        this.progress.config
      )

      const hero = this.map?.gameObjects.get(constants.HERO)

      if (hero) {
        hero.direction = this.progress.config.direction
        hero.x = this.progress.config.x
        hero.y = this.progress.config.y
      }
    }

    this.bindActionInput()
    this.bindHeroPosition()

    this.directionInput.init()
    this.gameLoop()

    this.map?.startCutscene([
      // { who: constants.HERO, type: 'walk', direction: 'down' },
      // { who: constants.HERO, type: 'walk', direction: 'down' },
      // { who: constants.NPC1, type: 'walk', direction: 'up' },
      // { who: constants.NPC1, type: 'walk', direction: 'left' },
      // {
      //   who: constants.HERO,
      //   type: 'stand',
      //   direction: 'right',
      //   time: 200
      // },
      // {
      //   type: 'textMessage',
      //   text: 'helloooooooooooooooooooooooooooooooooooo'
      // }
      // {
      //   type: 'changeMap',
      //   map: 'DemoRoom'
      // }
      // {
      //   type: 'battle',
      //   who: 'beth'
      // },
      // {
      //   type: 'battle',
      //   who: 'erio'
      // }
    ])

    this.hud = new HUD()

    this.hud.init(this.element! as HTMLDivElement)
  }
}

export default Overworld
