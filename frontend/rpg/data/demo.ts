import GameObject from '@/gameObject'
import Person from '@/person'
import utils from '@/utils'
import { GameMapConfig } from '@pl-types'
import personAnimations from './animations/person'

const gameObjects = new Map<string, GameObject>([
  [
    'hero',
    new Person({
      x: utils.withGrid(2),
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
      animations: personAnimations
    })
  ]
])

const map: GameMapConfig = {
  lowerSrc: '/images/maps/DemoLower.png',
  upperSrc: '/images/maps/DemoUpper.png',
  gameObjects
}

export default map
