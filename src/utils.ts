import { Direction } from '@pl-types'
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
  },
  emitEvent(name: string, detail: object) {
    const ev = new CustomEvent(name, {
      detail
    })

    document.dispatchEvent(ev)
  },
  isCustomEvent(event: Event): event is CustomEvent {
    return 'detail' in event
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortMap(map: Map<string, any>, sortKey: string) {
    return new Map(
      [...map.entries()].sort(
        (a, b) => a[1][sortKey] - b[1][sortKey]
      )
    )
  },
  oppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case 'left':
        return 'right'
      case 'right':
        return 'left'
      case 'up':
        return 'down'
      case 'down':
        return 'up'
      default:
        return 'down'
    }
  },
  wait(ms: number) {
    return new Promise(resolve =>
      setTimeout(() => {
        return resolve(null)
      }, ms)
    )
  },
  randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}
