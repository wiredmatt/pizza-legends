import utils from '@/utils'
import { Behaviour } from 'types'

export const BattleAnimations = {
  async spin(event: Behaviour, onComplete: () => void) {
    const element = event.caster?.pizza.getImgElement()

    if (!element) return

    const animationClassName =
      event.caster?.data.team === 'player'
        ? 'battle-spin-right'
        : 'battle-spin-left'

    element.classList.add(animationClassName)

    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(animationClassName)
      },
      {
        once: true
      }
    )

    await utils.wait(100)
    onComplete()
  }
}
