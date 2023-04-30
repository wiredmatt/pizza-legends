import C from '@/constants'
import { ActionItems } from '@/content/actions'
import { Enemy } from '@/content/enemies'
import { Pizzas } from '@/content/pizzas'
import { LitElement, PropertyValueMap, html } from 'lit'
import { CombatantConfig } from 'types'
import BattleEvent from './battle-event'
import Combatant from './combatant'
import { Team } from './team'
import TurnCycle from './turn-cycle'

export class LitBattle extends LitElement {
  enemy: Enemy
  onElementReady: (element?: HTMLDivElement) => void

  constructor(
    enemy: Enemy,
    onElementReady: (div?: HTMLDivElement) => void
  ) {
    super()
    this.onElementReady = onElementReady
    this.enemy = enemy
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
        <img src="${this.enemy.src}" />
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
  onComplete: () => void
  combatants: { [key: string]: Combatant }
  activeCombatants: { [key: string]: Combatant | null }
  items: {
    actionId: keyof ActionItems
    instanceId: string
    team: 'player' | 'enemy'
  }[]
  turnCycle: TurnCycle | null = null
  playerTeam: Team
  enemyTeam: Team
  enemy: Enemy
  usedItems: { [key: string]: boolean } = {}

  onElementReady = (element?: HTMLDivElement) => {
    if (element) {
      Object.keys(this.combatants).forEach(key => {
        const combatant = this.combatants[key]
        combatant.data.id = key

        combatant.init(element)
      })

      this.playerTeam.init(element)
      this.enemyTeam.init(element)

      this.playerTeam.update()
      this.enemyTeam.update()

      this.turnCycle = new TurnCycle(
        this,
        ev => {
          return new Promise(resolve => {
            const evt = new BattleEvent(this, ev)
            evt.init(resolve)
          })
        },
        winner => {
          if (winner === 'player') {
            Object.keys(globalThis.playerState!.pizzas).forEach(
              id => {
                const combatant = this.combatants[id]

                if (combatant) {
                  globalThis.playerState!.pizzas[id] = {
                    ...combatant.data
                  }
                }
              }
            )

            globalThis.playerState!.items =
              globalThis.playerState!.items.filter(
                item => !this.usedItems[item.instanceId]
              )
          } else {
            // heal all pizzas of the player
            Object.keys(globalThis.playerState!.pizzas).forEach(
              id => {
                const pizza = globalThis.playerState!.pizzas[id]

                pizza.hp = pizza.maxHp
                pizza.status = null
              }
            )
          }

          this.element.remove()
          this.onComplete()
        }
      )

      this.turnCycle.init()
    }
  }

  constructor(enemy: Enemy, onComplete: () => void) {
    this.callback = undefined
    this.onComplete = onComplete
    this.enemy = enemy

    this.element = new LitBattle(this.enemy, e => {
      this.onElementReady(e)
    })

    this.playerTeam = new Team({
      name: 'Hero',
      team: 'player',
      battle: this
    })

    this.enemyTeam = new Team({
      name: 'Some vile enemy',
      team: 'enemy',
      battle: this
    })

    this.combatants = {}
    this.activeCombatants = {
      player: null,
      enemy: null
    }

    globalThis.playerState?.lineup.forEach(id => {
      this.addCombatant(
        globalThis.playerState!.pizzas[id],
        'player'
      )
    })

    Object.keys(this.enemy.pizzas).forEach(id => {
      this.addCombatant(
        {
          ...this.enemy.pizzas[id],
          id: 'enemy_' + id
        },
        'enemy'
      )
    })

    this.items = []

    globalThis.playerState?.items.forEach(item => {
      this.items.push({
        ...item,
        actionId: item.actionId,
        instanceId: item.instanceId,
        team: 'player'
      })
    })
  }

  addCombatant(
    combatant: CombatantConfig,
    team: 'player' | 'enemy'
  ) {
    const c = new Combatant(
      {
        ...combatant,
        ...Pizzas[combatant.id as keyof typeof Pizzas],
        team
      },
      this
    )
    this.combatants[c.data.id] = c

    this.activeCombatants[team] =
      this.activeCombatants[team] || c
  }

  init(container: HTMLDivElement, callback: () => void) {
    this.callback = callback
    container.appendChild(this.element)
  }
}

export default Battle
