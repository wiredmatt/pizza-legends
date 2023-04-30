import { ActionItems } from '@/content/actions'
import { Pizzas } from '@/content/pizzas'
import { CombatantConfig } from 'types'

export class PlayerState {
  pizzas: { [key: string]: CombatantConfig } = {}
  lineup: string[] = []
  items: {
    actionId: keyof ActionItems
    instanceId: string
  }[] = []

  constructor() {
    this.pizzas = {
      player: {
        ...Pizzas['s001'],
        team: 'player',
        hp: 10,
        maxHp: 100,
        xp: 90,
        maxXp: 100,
        level: 1,
        id: 'player'
      },
      player2: {
        ...Pizzas['s002'],
        team: 'player',
        hp: 10,
        maxHp: 100,
        xp: 60,
        maxXp: 100,
        level: 1,
        status: null,
        id: 'player2'
      }
    }

    this.lineup = Object.keys(this.pizzas)

    this.items = [
      {
        actionId: 'item_recoverStatus',
        instanceId: 'p1'
      },
      {
        actionId: 'item_recoverStatus',
        instanceId: 'p2'
      },
      {
        actionId: 'item_recoverHp',
        instanceId: 'p4'
      }
    ]
  }
}
