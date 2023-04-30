import utils from '@/utils'
import { html, LitElement, PropertyValueMap } from 'lit'
import { Behaviour, CombatantConfig } from 'types'
import Battle from './battle'

export class LitCombatantHUD extends LitElement {
  onElementReady: (element?: HTMLDivElement) => void
  info: CombatantConfig
  battle: Battle

  constructor(
    onElementReady: (div?: HTMLDivElement) => void,
    info: CombatantConfig,
    battle: Battle
  ) {
    super()
    this.onElementReady = onElementReady
    this.info = info
    this.battle = battle
  }

  createRenderRoot() {
    return this
  }

  get hpPercent() {
    return (
      Math.floor((this.info.hp! / this.info.maxHp) * 100) || 0
    )
  }

  get xpPercent() {
    return (
      Math.floor((this.info.xp! / this.info.maxXp) * 100) || 0
    )
  }

  get isActive() {
    return (
      this.battle.activeCombatants[this.info.team]?.data.id ===
      this.info.id
    )
  }

  render() {
    return html`<div
      class="combatant"
      data-combatant="${this.id}"
      data-team="${this.info.team}"
      data-active="${this.isActive}"
    >
      <p class="combatant-name">${this.info.name}</p>
      <p class="combatant-level">${this.info.level}</p>

      <div class="combatant-character-crop">
        <img
          class="combatant-character"
          src="${this.info.src}"
          alt="${this.info.name}"
        />
      </div>

      <img
        class="combatant-type"
        src="${this.info.icon}"
        alt="${this.info.type}"
      />

      <svg viewBox="0 0 26 3" class="combatant-life-container">
        <rect
          x="0"
          y="0"
          width="${this.hpPercent}%"
          height="1"
          fill="#82ff71"
        />
        <rect
          x="0"
          y="1"
          width="${this.hpPercent}%"
          height="2"
          fill="#3ef126"
        />
      </svg>

      <svg viewBox="0 0 26 2" class="combatant-xp-container">
        <rect
          x="0"
          y="0"
          width="${this.xpPercent}%"
          height="1"
          fill="#ffd76a"
        />
        <rect
          x="0"
          y="1"
          width="${this.xpPercent}%"
          height="1"
          fill="#ffc934"
        />
      </svg>
      <p
        class="combatant-status"
        data-status-active="${!!this.info.status?.type}"
      >
        ${this.info.status?.type}
      </p>
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

  updateInfo() {
    this.requestUpdate()
  }
}

export class LitPizza extends LitElement {
  info: CombatantConfig
  battle: Battle

  constructor(config: CombatantConfig, battle: Battle) {
    super()

    this.info = config
    this.battle = battle
  }

  createRenderRoot() {
    return this
  }

  get isActive() {
    return (
      this.battle.activeCombatants[this.info.team]?.data.id ===
      this.info.id
    )
  }

  render() {
    return html`<img
      class="pizza"
      src="${this.info.src}"
      alt="${this.info.name}"
      data-team="${this.info.team}"
      data-active="${this.isActive}"
    />`
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)
  }

  getImgElement() {
    return this.querySelector('img') || undefined
  }

  updateInfo() {
    this.requestUpdate()
  }
}

class Combatant {
  element: LitCombatantHUD
  pizza: LitPizza
  battle: Battle
  data: CombatantConfig

  onElementReady = (element?: HTMLDivElement) => {
    // setInterval(() => {
    //   this.updateInfo({
    //     hp: this.data.hp - 5
    //   })
    // }, 200)
  }

  constructor(config: CombatantConfig, battle: Battle) {
    this.battle = battle
    this.data = {
      ...config,
      hp: config.hp || config.maxHp
    }
    this.element = new LitCombatantHUD(
      e => {
        this.onElementReady(e)
      },
      config,
      battle
    )
    this.pizza = new LitPizza(config, battle)
  }

  get givesXp() {
    return this.data.level * 20
  }

  init(container: HTMLDivElement) {
    container.appendChild(this.element)
    container.appendChild(this.pizza)
    this.element.updateInfo()
  }

  updateInfo(changes: Partial<CombatantConfig>) {
    this.data = {
      ...this.data,
      ...changes
    }
    this.element.info = { ...this.data, ...changes }
    this.element.updateInfo()
    this.pizza.updateInfo()
  }

  getPostEvents() {
    if (this.data.status?.type === 'saucy') {
      return [
        {
          type: 'textMessage',
          text: `${this.data.name} is saucy!`
        },
        {
          type: 'stateChange',
          recover: 5,
          statusOnCaster: true
        }
      ]
    }

    return []
  }

  decrementStatus() {
    if (!this.data?.status) {
      return null
    }

    if (this.data.status.expiresIn > 0) {
      this.data.status.expiresIn -= 1
    }

    if (this.data.status.expiresIn === 0) {
      const prevStatus = this.data.status.type

      this.updateInfo({
        status: undefined
      })

      return {
        type: 'textMessage',
        text: `${this.data.name} is no longer ${prevStatus}. Status expired.`
      }
    }
  }

  getReplacedEvents(events: Behaviour[]) {
    if (
      this.data.status?.type === 'clumsy' &&
      utils.randomFromArray([true, false, false])
    ) {
      return [
        {
          type: 'textMessage',
          text: `${this.data.name} floops over!`
        }
      ]
    }

    return events
  }
}

export default Combatant
