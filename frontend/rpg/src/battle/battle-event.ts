import TextMessage from '@/textMessage'
import utils from '@/utils'
import { Behaviour } from 'types'
import Battle from './battle'
import { BattleAnimations } from './battle-animations'
import SubmissionMenu from './submission-menu'

class BattleEvent {
  battle: Battle
  event: Behaviour

  constructor(battle: Battle, event: Behaviour) {
    this.battle = battle
    this.event = event
  }

  textMessage(resolve: (value: unknown) => void) {
    const container = this.battle.element.getDivElement()

    if (!container) return

    const text =
      this.event.text
        ?.replace(
          '{{CASTER}}',
          this.event.caster?.data.name || ''
        )
        .replace(
          '{{TARGET}}',
          this.event.target?.data.name || ''
        )
        .replace('{{ACTION}}', this.event.action?.name || '') ||
      ''

    const message = new TextMessage({
      text,
      onComplete: () => resolve('textMessage')
    })

    message.init(container)
  }

  submissionMenu(resolve: (value: unknown) => void) {
    const container = this.battle.element.getDivElement()
    if (!container) return

    const menu = new SubmissionMenu({
      caster: this.event.caster,
      target: this.event.target,
      onComplete: sub => resolve(sub),
      items: this.battle.items
    })

    menu.init(container)
  }

  async stateChange(resolve: (value: unknown) => void) {
    if (this.event.damage && this.event.target) {
      this.event.target.pizza.classList.add(
        'battle-damage-blink'
      )

      this.event.target.updateInfo({
        hp: this.event.target.data.hp - this.event.damage
      })

      await utils.wait(600)

      this.event.target.pizza.classList.remove(
        'battle-damage-blink'
      )
    }

    const statusTarget =
      this.event.statusOnCaster == true
        ? this.event.caster
        : this.event.target

    // if (this.event.action.targetType === 'friendly') { // for the future.
    //   statusTarget = this.event.caster
    // }

    if (this.event.recover) {
      if (!statusTarget) return

      const _newHp = statusTarget.data.hp + this.event.recover
      const newHp =
        _newHp > statusTarget.data.maxHp
          ? statusTarget.data.maxHp
          : _newHp

      statusTarget.updateInfo({
        hp: newHp
      })
    }

    if (this.event.status) {
      statusTarget?.updateInfo({
        status: { ...this.event.status }
      })
    }

    if (this.event.status === null) {
      statusTarget?.updateInfo({
        status: null
      })
    }

    resolve('stateChange')
  }

  async animation(resolve: (value: unknown) => void) {
    if (!this.event.animation) return

    const _animation = BattleAnimations[this.event.animation]

    _animation(this.event, () => resolve('animation'))
  }

  init(resolve: (value: unknown) => void) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[this.event.type](resolve)
  }
}

export default BattleEvent
