import { ActionItems } from '@/content/actions'
import { Pizzas } from '@/content/pizzas'
import utils from '@/utils'
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
        hp: 100,
        maxHp: 100,
        xp: 90,
        maxXp: 100,
        level: 1,
        id: 'player'
      },
      player2: {
        ...Pizzas['s002'],
        team: 'player',
        hp: 100,
        maxHp: 100,
        xp: 60,
        maxXp: 100,
        level: 1,
        status: null,
        id: 'player2'
      },
      player3: {
        ...Pizzas['v001'],
        team: 'player',
        hp: 100,
        maxHp: 100,
        xp: 60,
        maxXp: 100,
        level: 1,
        status: null,
        id: 'player3'
      }
    }

    this.lineup = Object.keys(this.pizzas).slice(0, 2)

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

  moveToFront(id: string) {
    this.lineup = this.lineup.filter(i => i !== id)
    this.lineup.unshift(id)

    utils.emitEvent('lineupChange', {})
  }

  swapLineup(old: string, incoming: string) {
    const index = this.lineup.indexOf(old)

    if (index === -1) {
      return
    }

    this.lineup[index] = incoming
    utils.emitEvent('lineupChange', {})
  }
}
