import Person from '@/person'
import utils from '@/utils'
import { MapConfig } from '@pl-types'
import personAnimations from './animations/person'

const map: MapConfig = {
  lowerSrc: '/images/maps/DemoLower.png',
  upperSrc: '/images/maps/DemoUpper.png',
  gameObjects: [
    new Person({
      x: utils.withGrid(2),
      y: utils.withGrid(6),
      shadow: '/images/characters/shadow.png',
      isPlayerControlled: true,
      animations: personAnimations
    }),
    new Person({
      x: utils.withGrid(7),
      y: utils.withGrid(9),
      src: '/images/characters/people/npc1.png',
      shadow: '/images/characters/shadow.png',
      animations: personAnimations
    })
  ]
}

export default map
