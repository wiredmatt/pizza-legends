import constants from '@/constants'
import GameObject from '@/gameObject'
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
    'npc3',
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
  gameObjects
}

export default map
