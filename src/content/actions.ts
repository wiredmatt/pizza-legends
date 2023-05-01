import { BattleAnimations } from '@/battle/battle-animations'
import { Behaviour } from '@pl-types'

export type ActionType = {
  name: string
  success: Array<Behaviour>
  statusOnCaster?: boolean
  description?: string
}

export const Actions = {
  damage1: {
    name: 'Whomp!',
    description: 'Inflicts 10 damage to the target',
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
  },
  saucyStatus: {
    name: 'Tomato Squeeze',
    description: 'Recovers HP for 3 turns',
    success: [
      {
        type: 'textMessage',
        text: '{{CASTER}} uses {{ACTION}}'
      },
      {
        type: 'stateChange',
        status: {
          type: 'saucy',
          expiresIn: 3
        },
        statusOnCaster: true,
        targetType: 'friendly'
      }
    ]
  },
  clumsyStatus: {
    name: 'Olive Oil Spread',
    description: "Lowers the target's accuracy for 3 turns",
    success: [
      {
        type: 'textMessage',
        text: '{{CASTER}} uses {{ACTION}} on {{TARGET}}'
      },
      {
        type: 'animation',
        animation: BattleAnimations.glob
          .name as keyof typeof BattleAnimations,
        color: '#dafd2a'
      },
      {
        type: 'stateChange',
        status: {
          type: 'clumsy',
          expiresIn: 3
        }
      },
      {
        type: 'textMessage',
        text: '{{TARGET}} is slipping all around!'
      }
    ]
  },
  item_recoverStatus: {
    name: 'Healing Lamp',
    description: 'Removes any status applied to the caster',
    statusOnCaster: true,
    targetType: 'friendly',
    success: [
      {
        type: 'textMessage',
        text: '{{CASTER}} uses a {{ACTION}}'
      },
      {
        type: 'stateChange',
        status: null,
        targetType: 'friendly'
      },
      {
        type: 'textMessage',
        text: '{{CASTER}} is feeling fresh!'
      }
    ]
  },
  item_recoverHp: {
    name: 'Parmesan',
    description: 'Heals 10 HP to the caster',
    statusOnCaster: true,
    targetType: 'friendly',
    success: [
      {
        type: 'textMessage',
        text: '{{CASTER}} sprinkles on some {{ACTION}}'
      },
      {
        type: 'stateChange',
        recover: 10
      },
      {
        type: 'textMessage',
        text: '{{CASTER}} recovers HP!'
      }
    ]
  }
}

// A type that is the union of all the keys of the Actions object starting with `item_`
export type ActionItems = {
  [K in keyof typeof Actions as K extends `item_${string}`
    ? K
    : never]: typeof Actions[K]
}
