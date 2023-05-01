import utils from '@/utils'
import { Behaviour } from '@pl-types'

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
  },
  async glob(event: Behaviour, onComplete: () => void) {
    const div = document.createElement('div')

    div.classList.add('glob-orb')

    div.innerHTML = `
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${event.color}" />
      </svg>`

    div.classList.add(
      event.caster?.data.team === 'player'
        ? 'glob-orb-right'
        : 'glob-orb-left'
    )

    div.addEventListener(
      'animationend',
      () => {
        div.remove()
      },
      {
        once: true
      }
    )

    event.caster?.battle.element
      .getDivElement()
      ?.appendChild(div)

    await utils.wait(820)

    onComplete()
  }
}
