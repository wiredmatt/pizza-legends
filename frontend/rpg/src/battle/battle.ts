import C from '@/constants'
import { Pizzas } from '@/content/pizzas'
import { html, LitElement, PropertyValueMap } from 'lit'
import Combatant from './combatant'

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
  activeCombatants: { [key: string]: Combatant }

  onElementReady = (element?: HTMLDivElement) => {
    if (element) {
      Object.keys(this.combatants).forEach(key => {
        const combatant = this.combatants[key]
        combatant.data.id = key

        combatant.init(element)
      })
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
          status: null,
          id: 'player'
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...Pizzas['v001'],
          team: 'enemy',
          hp: 50,
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
          hp: 50,
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
  }

  init(container: HTMLDivElement, callback: () => void) {
    this.callback = callback
    container.appendChild(this.element)
  }
}

export default Battle