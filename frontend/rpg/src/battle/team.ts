import { LitElement, PropertyValueMap, html } from 'lit'
import Battle from './battle'

export class LitTeam extends LitElement {
  info: TeamConfig

  constructor(config: TeamConfig) {
    super()
    this.info = config
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`<div class="team" data-team="${this.info.team}">
      ${Object.values(this.info.battle.combatants)
        ?.filter(c => c.data.team === this.info.team)
        .map(
          combatant => html`
            <div
              data-combatant="${combatant.data.id}"
              data-dead="${(this.info.battle.combatants[
                combatant.data.id
              ]?.data.hp || 0) <= 0}"
              data-active="${this.info.battle.activeCombatants[
                this.info.team
              ]?.data.id === combatant.data.id}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                viewBox="0 -0.5 7 10"
                shape-rendering="crispEdges"
              >
                <path
                  stroke="#3a160d"
                  d="M2 0h3M1 1h1M5 1h1M0 2h1M6 2h1M0 3h1M6 3h1M0 4h1M6 4h1M1 5h1M5 5h1M2 6h3"
                />
                <path
                  stroke="#e2b051"
                  d="M2 1h1M4 1h1M1 2h1M5 2h1M1 4h1M5 4h1M2 5h1M4 5h1"
                />
                <path
                  stroke="#ffd986"
                  d="M3 1h1M2 2h3M1 3h5M2 4h3M3 5h1"
                />

                <!-- Active indicator appears when needed with CSS -->
                <path
                  class="active-pizza-indicator"
                  stroke="#3a160d"
                  d="M3 8h1M2 9h3"
                />

                <!-- Dead paths appear when needed with CSS -->
                <path
                  class="dead-pizza"
                  stroke="#3a160d"
                  d="M2 0h3M1 1h1M5 1h1M0 2h1M2 2h1M4 2h1M6 2h1M0 3h1M3 3h1M6 3h1M0 4h1M2 4h1M4 4h1M6 4h1M1 5h1M5 5h1M2 6h3"
                />
                <path
                  class="dead-pizza"
                  stroke="#9b917f"
                  d="M2 1h3M1 2h1M5 2h1"
                />
                <path
                  class="dead-pizza"
                  stroke="#c4bdae"
                  d="M3 2h1M1 3h2M4 3h2M1 4h1M3 4h1M5 4h1M2 5h3"
                />
              </svg>
            </div>
          `
        )}
    </div>`
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)
  }

  getDivElement() {
    return this.querySelector('div') || undefined
  }

  updateInfo() {
    this.requestUpdate()
  }
}

type TeamConfig = {
  team: 'player' | 'enemy'
  name: string
  battle: Battle
}

export class Team {
  info: TeamConfig
  element: LitTeam

  constructor(config: TeamConfig) {
    this.info = config
    this.element = new LitTeam(config)
  }

  update() {
    this.element.info = this.info
    this.element.updateInfo()
  }

  init(container: HTMLDivElement) {
    container.appendChild(this.element)
  }
}
