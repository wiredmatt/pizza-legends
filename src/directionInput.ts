import { Direction, KeyMap } from '@pl-types'

class DirectionInput {
  keyMap: KeyMap
  heldDirections: Direction[]

  constructor() {
    this.heldDirections = []
    this.keyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',

      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right'
    }
  }

  get direction() {
    return this.heldDirections[0]
  }

  init() {
    document.addEventListener('keydown', e => {
      const dir = this.keyMap[e.key]
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir)
      }
    })

    document.addEventListener('keyup', e => {
      const dir = this.keyMap[e.key]
      const index = this.heldDirections.indexOf(dir)
      if (index > -1) {
        this.heldDirections.splice(index, 1)
      }
    })
  }
}

export default DirectionInput
