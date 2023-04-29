import C from '@/constants'
import { ActionItems } from '@/content/actions'
import { Pizzas } from '@/content/pizzas'
import { LitElement, PropertyValueMap, html } from 'lit'
import BattleEvent from './battle-event'
import Combatant from './combatant'
import TurnCycle from './turn-cycle'

export class LitBattle extends LitElement {
  onElementReady: (element?: HTMLDivElement) => void

  constructor(onElementReady: (div?: HTMLDivElement) => void) {
    super()
    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`<div class="battle">
      <div class="battle-hero">
        <img src="${C.HERO_SPRITE}" />
      </div>
      <div class="battle-enemy">
        <img src="${C.NPC3_SPRITE}" />
      </div>
    </div>`
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)

    this.onElementReady(this.getDivElement())
  }

  getDivElement() {
    return this.querySelector('div') || undefined
  }
}

class Battle {
  element: LitBattle
  callback?: () => void
  onComplete?: () => void
  combatants: { [key: string]: Combatant }
  activeCombatants: { [key: string]: Combatant | null }
  items: {
    actionId: keyof ActionItems
    instanceId: string
    team: 'player' | 'enemy'
  }[]
  turnCycle: TurnCycle | null = null

  onElementReady = (element?: HTMLDivElement) => {
    if (element) {
      Object.keys(this.combatants).forEach(key => {
        const combatant = this.combatants[key]
        combatant.data.id = key

        combatant.init(element)
      })

      this.turnCycle = new TurnCycle(this, ev => {
        return new Promise(resolve => {
          const evt = new BattleEvent(this, ev)
          evt.init(resolve)
        })
      })

      this.turnCycle.init()
    }
  }

  constructor(onComplete?: () => void) {
    this.callback = undefined
    this.onComplete = onComplete
    this.element = new LitBattle(e => {
      this.onElementReady(e)
    })

    this.combatants = {
      player: new Combatant(
        {
          ...Pizzas['s001'],
          team: 'player',
          hp: 100,
          maxHp: 100,
          xp: 60,
          maxXp: 100,
          level: 1,
          // status: {
          //   type: 'clumsy',
          //   expiresIn: 3
          // },
          id: 'player'
        },
        this
      ),
      player2: new Combatant(
        {
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
        this
      ),
      enemy1: new Combatant(
        {
          ...Pizzas['v001'],
          team: 'enemy',
          hp: 10,
          maxHp: 50,
          xp: 20,
          maxXp: 100,
          level: 1,
          status: null,
          id: 'enemy1'
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...Pizzas['f001'],
          team: 'enemy',
          hp: 10,
          maxHp: 50,
          xp: 30,
          maxXp: 100,
          level: 1,
          status: null,
          id: 'enemy2'
        },
        this
      )
    }

    this.activeCombatants = {
      player: this.combatants.player,
      enemy: this.combatants.enemy1
    }

    this.items = [
      {
        actionId: 'item_recoverStatus',
        instanceId: 'p1',
        team: 'player'
      },
      {
        actionId: 'item_recoverStatus',
        instanceId: 'p2',
        team: 'player'
      },
      {
        actionId: 'item_recoverStatus',
        instanceId: 'p3',
        team: 'enemy'
      },
      {
        actionId: 'item_recoverHp',
        instanceId: 'p4',
        team: 'player'
      }
    ]
  }

  init(container: HTMLDivElement, callback: () => void) {
    this.callback = callback
    container.appendChild(this.element)
  }
}

export default Battle
