import GameObject from '@/gameObject'
import Person from '@/person'
import utils from '@/utils'
import { GameMapConfig } from '@pl-types'
import personAnimations from './animations/person'

const gameObjects = new Map<string, GameObject>([
  [
    'hero',
    new Person({
      x: utils.withGrid(5),
      y: utils.withGrid(6),
      shadow: '/images/characters/shadow.png',
      isPlayerControlled: true,
      animations: personAnimations
    })
  ],
  [
    'npc1',
    new Person({
      x: utils.withGrid(7),
      y: utils.withGrid(9),
      src: '/images/characters/people/npc1.png',
      shadow: '/images/characters/shadow.png',
      animations: personAnimations,
      behaviourLoop: [
        {
          type: 'stand',
          direction: 'left',
          time: 800
        },
        {
          type: 'stand',
          direction: 'up',
          time: 800
        },
        {
          type: 'stand',
          direction: 'right',
          time: 1200
        },
        {
          type: 'stand',
          direction: 'up',
          time: 300
        }
      ]
    })
  ],
  [
    'npc2',
    new Person({
      x: utils.withGrid(3),
      y: utils.withGrid(8),
      src: '/images/characters/people/npc2.png',
      shadow: '/images/characters/shadow.png',
      animations: personAnimations,
      behaviourLoop: [
        {
          type: 'walk',
          direction: 'left'
        },
        {
          type: 'stand',
          direction: 'up',
          time: 800
        },
        {
          type: 'walk',
          direction: 'up'
        },
        {
          type: 'walk',
          direction: 'right'
        },
        {
          type: 'walk',
          direction: 'down'
        }
      ]
    })
  ]
])

const map: GameMapConfig = {
  lowerSrc: '/images/maps/DemoLower.png',
  upperSrc: '/images/maps/DemoUpper.png',
  gameObjects,
  walls: {
    [utils.asGridCoord(7, 6)]: true,
    [utils.asGridCoord(8, 6)]: true,
    [utils.asGridCoord(7, 7)]: true,
    [utils.asGridCoord(8, 7)]: true
  }
}

export default map
