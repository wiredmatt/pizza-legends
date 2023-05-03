import { GameObjectConfig, GameObjectState } from 'types'
import GameObject from './game-object'
import Sprite from './sprite'

export class PizzaStone extends GameObject {
  constructor(config: GameObjectConfig) {
    super(config)

    this.sprite = new Sprite({
      gameObject: this,
      src: '/images/characters/pizza-stone.png',
      animations: {
        'used-down': [[0, 0]],
        'unused-down': [[1, 0]]
      },
      currentAnimation: 'used-down'
    })

    this.talking = [
      {
        requires: ['PIZZA_STONE_USED'],
        events: [
          {
            type: 'textMessage',
            text: "You've already used this."
          }
        ]
      },
      {
        events: [
          {
            type: 'textMessage',
            text: 'Approaching the legendary pizza stone...'
          },
          {
            type: 'craftingMenu',
            pizzas: this.pizzas,
            flag: 'PIZZA_STONE_USED'
          }
        ]
      }
    ]
  }

  update(state: GameObjectState): void {
    this.sprite.currentAnimation = globalThis.playerState
      ?.storyFlags['PIZZA_STONE_USED']
      ? 'used-down'
      : 'unused-down'
  }
}
