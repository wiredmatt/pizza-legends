import { Behaviour, GameEventConfig } from 'types'
import GameMap from './gameMap'
import Person from './person'

class GameEvent {
  map: GameMap
  event: Behaviour

  constructor({ map, event }: GameEventConfig) {
    this.map = map
    this.event = event
  }

  init() {
    return new Promise((resolve, reject) => {
      this[this.event.type as 'stand' | 'walk'](resolve, reject)
    })
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
}

export default GameEvent
