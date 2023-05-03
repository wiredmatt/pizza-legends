import { Behaviour, GameEventConfig } from '@pl-types'
import Battle from './battle/battle'
import { CraftingMenu } from './crafting-menu'
import GameMap from './game-map'
import { PauseMenu } from './pause-menu'
import Person from './person'
import SceneTransition from './scene-transition'
import TextMessage from './text-message'
import utils from './utils'

class GameEvent {
  map: GameMap
  event: Behaviour
  pauseMenu: PauseMenu | null = null

  constructor({ map, event }: GameEventConfig) {
    this.map = map
    this.event = event
  }

  init() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return this[this.event.type](resolve, reject)
    })
  }

  getContainer() {
    const container = document.querySelector('.game-container')

    if (!container) {
      return null
    } else {
      return container
    }
  }

  stand(
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void
  ) {
    const who = this.map.gameObjects.get(this.event.who || '')

    if (who && who instanceof Person) {
      who.startBehaviour(
        {
          map: this.map
        },
        {
          type: 'stand',
          direction: this.event.direction,
          time: this.event.time
        }
      )

      const completeHandler = (e: {
        detail: { who: string }
      }) => {
        if (e.detail.who === this.event.who) {
          document.removeEventListener(
            'personStandingComplete',
            completeHandler
          )

          resolve(`${e.detail.who} - stand`)
        }
      }

      document.addEventListener(
        'personStandingComplete',
        completeHandler
      )
    } else {
      reject('Invalid ID or object is not Person')
    }
  }

  walk(
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void
  ) {
    const who = this.map.gameObjects.get(this.event.who || '')

    if (who && who instanceof Person) {
      who.startBehaviour(
        {
          map: this.map
        },
        {
          type: 'walk',
          direction: this.event.direction,
          retry: true
        }
      )

      const completeHandler = (e: {
        detail: { who: string }
      }) => {
        if (e.detail.who === this.event.who) {
          document.removeEventListener(
            'personWalkingComplete',
            completeHandler
          )

          resolve(`${e.detail.who} - walk`)
        }
      }

      document.addEventListener(
        'personWalkingComplete',
        completeHandler
      )
    } else {
      reject('Invalid ID or object is not Person')
    }
  }

  textMessage(
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void
  ) {
    const container = this.getContainer()
    if (!container) return reject('Container not found')

    if (this.event.text) {
      if (this.event.who && this.event.trigger) {
        const target = this.map.gameObjects.get(this.event.who)

        const trigger = this.map.gameObjects.get(
          this.event.trigger
        )

        if (target && trigger) {
          target.direction = utils.oppositeDirection(
            trigger.direction
          )
        }
      }

      const message = new TextMessage({
        text: this.event.text,
        onComplete: () => {
          this.checkProgression()
          resolve('textMessage')
        }
      })

      message.init(container as HTMLDivElement)
    }
  }

  changeMap(
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void
  ) {
    const container = this.getContainer()
    if (!container) return reject('Container not found')

    if (this.event.map) {
      const transition = new SceneTransition()

      transition.init(container as HTMLDivElement, () => {
        this.map.overworld?.changeMap(this.event.map)
        resolve(`chaged map to ${this.event.map}`)
        transition.fadeOut()
        this.checkProgression()
      })
    } else {
      reject(`No map specified`)
    }
  }

  battle(
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void
  ) {
    const container = this.getContainer()
    if (!container) return reject('Container not found')

    const battle = new Battle(
      globalThis.enemies[this.event.who!],
      winner => {
        resolve(winner)

        if (winner === 'player') {
          this.checkProgression() // only if player wins
        }
      }
    )

    battle.init(container as HTMLDivElement, () => {
      console.log('battle init complete')
    })
  }

  pause(resolve: (value: unknown) => void) {
    this.map.isPaused = true

    this.pauseMenu = new PauseMenu({
      onComplete: () => {
        this.map.isPaused = false
        this.map.overworld?.gameLoop()

        return resolve('pause')
      }
    })

    this.pauseMenu.init(this.getContainer() as HTMLDivElement)
  }

  checkProgression() {
    if (!this.event.flag) return
    globalThis.playerState!.storyFlags[this.event.flag] = true
    return this.event.flag
  }

  craftingMenu(resolve: (value: unknown) => void) {
    if (!this.event.pizzas) return

    const menu = new CraftingMenu(this.event.pizzas, () => {
      resolve('craftingMenu')
      this.checkProgression()
    })

    menu.init(this.getContainer() as HTMLDivElement)
  }
}

export default GameEvent
