import { Direction } from 'types'
import constants from './constants'

export default {
  withGrid: (n: number) => n * constants.SIZE,
  capitalize: (_str: string) =>
    _str.charAt(0).toUpperCase() + _str.slice(1),
  asGridCoord: (x: number, y: number) =>
    `${x * constants.SIZE},${y * constants.SIZE}`,
  nextPosition: (
    initialX: number,
    initialY: number,
    direction: Direction
  ) => {
    let x = initialX
    let y = initialY

    const size = constants.SIZE
    switch (direction) {
      case 'left':
        x -= size
        break
      case 'right':
        x += size
        break
      case 'up':
        y -= size
        break
      case 'down':
        y += size
        break

      default:
        break
    }

    return { x, y }
  }
}
