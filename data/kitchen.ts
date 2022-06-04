import GameObject from '@/gameObject'
import { MapConfig } from '@pl-types'

const map: MapConfig = {
  lowerSrc: '/images/maps/KitchenLower.png',
  upperSrc: '/images/maps/KitchenUpper.png',
  gameObjects: [
    new GameObject({
      x: 2,
      y: 4,
      shadow: '/images/characters/shadow.png'
    }),
    new GameObject({
      x: 7,
      y: 9,
      src: '/images/characters/people/npc2.png',
      shadow: '/images/characters/shadow.png'
    }),
    new GameObject({
      x: 3,
      y: 9,
      src: '/images/characters/people/npc3.png',
      shadow: '/images/characters/shadow.png'
    })
  ]
}

export default map
