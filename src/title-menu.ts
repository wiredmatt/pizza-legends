import { LitElement, PropertyValueMap, html } from 'lit'
import { KeyboardMenuOption } from 'types'
import { KeyboardMenu } from './battle/keyboard-menu'
import { Progress } from './progress'

export class LitTitleMenu extends LitElement {
  onElementReady: (element: HTMLDivElement) => void

  constructor(onElementReady: (div: HTMLDivElement) => void) {
    super()

    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`<div class="title-screen">
      <img class="title-screen-logo" src="/images/logo.png" alt="Pizza Legends"></img>
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

export class TitleMenu {
  element: LitTitleMenu | null = null
  keyboardMenu: KeyboardMenu | null = null
  progress: Progress

  constructor(progress: Progress) {
    this.progress = progress
  }

  options(
    resolve: (value: unknown) => void
  ): KeyboardMenuOption[] {
    const _options = [
      {
        label: 'Continue',
        description: 'Continue your saved game',
        handler: () => {
          resolve('continue')
          this.close()
        }
      },
      {
        label: 'New Game',
        description: 'Start a New Game',
        handler: () => {
          resolve('new-game')
          this.close()
        }
      }
    ]

    if (!this.progress.load()) {
      _options.shift()
    }

    return _options
  }

  close() {
    this.keyboardMenu?.end()
    this.element?.remove()
  }

  init(
    container: HTMLDivElement
  ): Promise<'new-game' | 'continue'> {
    return new Promise(resolve => {
      this.element = new LitTitleMenu((div: HTMLDivElement) => {
        this.keyboardMenu = new KeyboardMenu(
          {
            options: this.options(resolve)
          },
          container
        )

        this.keyboardMenu.init(div)
      })

      container.appendChild(this.element)
    })
  }
}
