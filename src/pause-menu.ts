import { LitElement, PropertyValueMap, html } from 'lit'
import { KeyboardMenu } from './battle/keyboard-menu'
import KeyPressListener from './key-press-listener'

export class LitPauseMenu extends LitElement {
  onElementReady: (element: HTMLDivElement) => void

  constructor(onElementReady: (div: HTMLDivElement) => void) {
    super()
    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`<div class="pause-menu">
      <h2>Pause Menu</h2>
    </div>`
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

type PauseMenuConfig = {
  onComplete: () => void
}

export class PauseMenu {
  element: LitPauseMenu | null = null
  keyboardMenu: KeyboardMenu | null = null
  esc: KeyPressListener
  shown: boolean = false
  config: PauseMenuConfig
  prevKey: string | null = null

  toggle() {
    this.esc?.unbind()
    this.keyboardMenu?.end()
    this.element?.remove()
    this.config.onComplete()
  }

  get options() {
    const lineUpPizzas =
      globalThis.playerState?.lineup.map(id => {
        const pizza = globalThis.playerState?.pizzas[id]!

        return {
          label: pizza.name,
          description: pizza.description || '',
          handler: () => {
            this.keyboardMenu?.setOptions(
              this.options.pizzaActions
            )
            this.prevKey = pizza.id
          }
        }
      }) || []

    const unequippedPizzas = Object.keys(
      globalThis.playerState?.pizzas || {}
    )
      .filter(id => {
        return globalThis.playerState?.lineup.indexOf(id) === -1
      })
      .map(id => {
        const pizza = globalThis.playerState?.pizzas[id]!

        return {
          label: `Swap for ${pizza.name}`,
          description: pizza.description || '',
          handler: () => {
            if (!this.prevKey) return

            globalThis.playerState?.swapLineup(this.prevKey, id)

            console.log('swapped for', pizza.name)
            this.keyboardMenu?.setOptions(this.options.root)
          }
        }
      })

    return {
      root: [
        ...lineUpPizzas,
        {
          label: 'Resume',
          description: 'Resume the game',
          handler: () => {
            this.toggle()
          }
        }
      ],
      pizzaActions: [
        ...unequippedPizzas,
        {
          label: 'Move to front',
          description:
            'Move this pizza to the front of the lineup',
          handler: () => {
            console.log('prevKey', this.prevKey)
            if (!this.prevKey) return

            globalThis.playerState?.moveToFront(this.prevKey)

            console.log('moved to front')
            this.keyboardMenu?.setOptions(this.options.root)
          }
        },
        {
          label: 'Back',
          description: 'Go back to the main menu',
          handler: () => {
            this.keyboardMenu?.setOptions(this.options.root)
          }
        }
      ]
    }
  }

  constructor(config: PauseMenuConfig) {
    this.config = config

    this.esc = new KeyPressListener('Escape', () => {
      this.toggle()
    })
  }

  init(container: HTMLDivElement) {
    this.element = new LitPauseMenu(div => {
      this.keyboardMenu = new KeyboardMenu(
        {
          options: this.options.root
        },
        container
      )

      this.keyboardMenu.init(div)
    })

    container.appendChild(this.element)
  }
}
