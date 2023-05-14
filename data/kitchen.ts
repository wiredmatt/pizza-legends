import constants from '@/constants'
import GameObject from '@/game-object'
import Person from '@/person'
import utils from '@/utils'
import { GameMapConfig } from '@pl-types'
import personAnimations from './animations/person'

const gameObjects = new Map<string, GameObject>([
  [
    constants.HERO,
    new Person({
      x: utils.withGrid(5),
      y: utils.withGrid(5),
      shadow: constants.SHADOW_SPRITE,
      isPlayerControlled: true,
      animations: personAnimations
    })
  ],
  [
    constants.NPC3,
    new Person({
      x: utils.withGrid(10),
      y: utils.withGrid(8),
      src: constants.NPC3_SPRITE,
      shadow: constants.SHADOW_SPRITE,
      animations: personAnimations,
      talking: [
        {
          events: [
            {
              who: constants.NPC3,
              type: 'textMessage',
              text: 'hello brooo',
              trigger: constants.HERO
            }
          ]
        }
      ]
    })
  ]
])

const map: GameMapConfig = {
  lowerSrc: constants.KITCHEN_LOWER_SPRITE,
  upperSrc: constants.KITCHEN_UPPER_SPRITE,
  gameObjects,
  cutsceneSpaces: {
    [utils.asGridCoord(5, 10)]: [
      {
        events: [
          {
            type: 'changeMap',
            map: 'Street',
            x: utils.withGrid(29),
            y: utils.withGrid(9),
            direction: 'down'
          }
        ]
      }
    ]
  }
}

export default map
