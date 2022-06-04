import { OwConfig } from '@pl-types'
import GameObject from './gameObject'

class Overworld {
  element: HTMLElement | null
  canvas?: HTMLCanvasElement | null
  ctx?: CanvasRenderingContext2D | null

  constructor(config: OwConfig) {
    this.element = config.element
    this.canvas = this.element?.querySelector('.game-canvas')
    this.ctx = this.canvas?.getContext('2d')
  }

  init() {
    const image = new Image()
    image.onload = () => {
      this.ctx?.drawImage(image, 0, 0)
    }
    image.src = '/images/maps/DemoLower.png'

    const hero = new GameObject({
      x: 5,
      y: 6,
      shadow: '/images/characters/shadow.png',
    })

    const npc1 = new GameObject({
      x: 7,
      y: 9,
      src: '/images/characters/people/npc1.png',
      shadow: '/images/characters/shadow.png',
    })

    setTimeout(() => {
      hero.sprite.draw(this.ctx)
      npc1.sprite.draw(this.ctx)
    }, 200)
  }
}

export default Overworld
