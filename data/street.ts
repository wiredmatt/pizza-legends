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
      x: utils.withGrid(30),
      y: utils.withGrid(10),
      src: constants.HERO_SPRITE,
      shadow: constants.SHADOW_SPRITE,
      isPlayerControlled: true,
      animations: personAnimations
    })
  ]
])

const map: GameMapConfig = {
  lowerSrc: constants.STREET_LOWER_SPRITE,
  upperSrc: constants.STREET_UPPER_SPRITE,
  gameObjects,
  cutsceneSpaces: {
    [utils.asGridCoord(29, 9)]: [
      {
        events: [
          {
            type: 'changeMap',
            map: 'Kitchen',
            x: utils.withGrid(5),
            y: utils.withGrid(10),
            direction: 'up'
          }
        ]
      }
    ]
  }
}

export default map
