import { LitElement, PropertyValueMap, html } from 'lit'
import { KeyboardMenu } from './battle/keyboard-menu'
import { Pizzas } from './content/pizzas'

export class LitCraftingMenu extends LitElement {
  onElementReady: (element: HTMLDivElement) => void

  constructor(onElementReady: (div: HTMLDivElement) => void) {
    super()
    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`<div class="overlay-menu crafting-menu">
      <h2>Create a new Pizza</h2>
    </div> `
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)
    this.onElementReady(this.getDivElement()!)
  }

  getDivElement() {
    return this.querySelector('div') || undefined
  }
}

export class CraftingMenu {
  pizzas: (keyof typeof Pizzas)[]
  onComplete: () => void
  element: LitCraftingMenu | null = null
  keyboardMenu: KeyboardMenu | null = null
  // esc: KeyPressListener

  get options() {
    return this.pizzas.map(pizza => {
      return {
        label: Pizzas[pizza].name,
        description: Pizzas[pizza].description,
        handler: () => {
          globalThis.playerState?.addPizza({
            ...Pizzas[pizza],
            id:
              'player' +
              (
                Object.keys(globalThis.playerState?.pizzas)
                  .length || 0
              ).toString(),
            team: 'player',
            level: 1
          })

          this.toggle()
        }
      }
    })
  }

  constructor(
    pizzas: (keyof typeof Pizzas)[],
    onComplete: () => void
  ) {
    this.pizzas = pizzas
    this.onComplete = onComplete
  }

  toggle() {
    this.keyboardMenu?.end()
    this.element?.remove()
    this.onComplete()
  }

  init(container: HTMLDivElement) {
    this.element = new LitCraftingMenu(div => {
      this.keyboardMenu = new KeyboardMenu(
        {
          options: this.options
        },
        container
      )

      this.keyboardMenu.init(div)
    })

    container.appendChild(this.element)
  }
}
