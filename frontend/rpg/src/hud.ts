import { LitElement, PropertyValueMap, html } from 'lit'
import { LitCombatantHUD } from './battle/combatant'

export class LitHUD extends LitElement {
  onElementReady: (element?: HTMLDivElement) => void
  parent: HTMLDivElement

  constructor(
    parent: HTMLDivElement,
    onElementReady: (div?: HTMLDivElement) => void
  ) {
    super()
    this.onElementReady = onElementReady
    this.parent = parent
  }

  createRenderRoot() {
    return this
  }
  render() {
    return html`<div class="hud">
      ${playerState?.lineup.map(combatant => {
        const el = new LitCombatantHUD(
          () => {},
          playerState!.pizzas[combatant],
          null
        )
        return el
      })}
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

export class HUD {
  element: LitHUD | null = null

  constructor() {}

  init(element: HTMLDivElement) {
    this.element = new LitHUD(element, () => {})

    element.appendChild(this.element)

    this.update()

    document.addEventListener('playerStateUpdated', () => {
      this.update()
    })

    document.addEventListener('lineupChange', () => {
      this.update()
    })
  }

  update() {
    this.element!.updateInfo()
  }
}
