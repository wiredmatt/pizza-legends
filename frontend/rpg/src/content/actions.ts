import { BattleAnimations } from '@/battle/battle-animations'
import { Behaviour } from 'types'

export type ActionType = {
  name: string
  success: Array<Behaviour>
}

export const Actions = {
  damage1: {
    name: 'Whomp!',
    success: [
      {
        type: 'textMessage',
        text: '{{CASTER}} uses Whomp! on {{TARGET}}'
      },
      {
        type: 'animation',
        animation: BattleAnimations.spin
          .name as keyof typeof BattleAnimations
      },
      {
        type: 'stateChange',
        damage: 10
      }
    ]
  }
}
