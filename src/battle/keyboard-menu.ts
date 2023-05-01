import KeyPressListener from '@/keyPressListener'
import {
  KeyboardMenuConfig,
  KeyboardMenuOption
} from '@pl-types'
import { LitElement, PropertyValueMap, html } from 'lit'

export class LitMenu extends LitElement {
  options: KeyboardMenuOption[] = []
  onElementReady: (element: HTMLDivElement) => void

  constructor(
    options: KeyboardMenuOption[],
    onElementReady: (div: HTMLDivElement) => void
  ) {
    super()
    this.options = options
    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <div class="keyboard-menu">
        ${this.options.map(
          (option, i) =>
            html`
              <div class="option">
                <button
                  data-button="${i}"
                  data-disabled="${!!option.disabled}"
                  data-description="${option.description}"
                >
                  ${option.label}
                </button>
                <span class="right">
                  ${option.right ? option.right() : ''}
                </span>
              </div>
            `
        )}
      </div>
    `
  }

  getDivElement() {
    return this.querySelector('div') || undefined
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)

    this.onElementReady(this.getDivElement()!)
  }
}

export class LitDescription extends LitElement {
  text?: string = ''
  onElementReady: (element?: HTMLDivElement) => void

  createRenderRoot() {
    return this
  }

  setText(text: string) {
    this.text = text
    this.requestUpdate()
  }

  constructor(onElementReady: (div?: HTMLDivElement) => void) {
    super()
    this.onElementReady = onElementReady
  }

  render() {
    return html`
      <div class="description-box">
        <p>${this.text}</p>
      </div>
    `
  }

  getDivElement() {
    return this.querySelector('div') || undefined
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)

    this.onElementReady(this.getDivElement())
  }
}

export class KeyboardMenu {
  config: KeyboardMenuConfig
  element: LitMenu
  descriptionElement: LitDescription
  descriptionContainer?: HTMLDivElement

  constructor(
    config: KeyboardMenuConfig = {
      options: []
    },
    descriptionContainer?: HTMLDivElement
  ) {
    this.config = config

    this.descriptionElement = new LitDescription(() => {
      console.log('description element ready')
    })

    this.element = new LitMenu(
      this.config.options,
      this.onElementReady
    )

    this.descriptionContainer = descriptionContainer
  }

  resetFocus() {
    ;(
      this.element.querySelectorAll(
        'button[data-disabled="false"]'
      )[0] as HTMLElement
    ).focus() // focus first button
  }

  onElementReady = (element?: HTMLDivElement | LitElement) => {
    if (element) {
      this.element!.querySelectorAll('button').forEach(
        button => {
          button.addEventListener('click', e => {
            const chosenOption =
              this.config.options[
                Number(button.dataset['button'])
              ]

            chosenOption.handler()
          })

          button.addEventListener('mouseenter', e => {
            button.focus()
          })

          button.addEventListener('focus', e => {
            console.log(button.dataset['button'])
            this.config.prevFocus = button
            this.descriptionElement.setText(
              button.dataset['description'] || ''
            )
          })
        }
      )

      this.config.up = new KeyPressListener('ArrowUp', () => {
        const current = Number(
          this.config.prevFocus?.dataset['button']
        )

        const prevButton = Array.from(
          this.element.querySelectorAll('button')
        )
          .reverse()
          .sort((a, b) => {
            return (
              Number(b?.dataset['button']) -
              Number(a?.dataset['button'])
            )
          })
          .find((el: HTMLElement) => {
            return (
              Number(el?.dataset['button']) < current &&
              el.dataset['disabled'] === 'false'
            )
          }) as HTMLElement | undefined

        if (prevButton) {
          prevButton.focus()
        } else {
          ;(
            this.element!.querySelectorAll(
              'button[data-disabled="false"]'
            )[this.config.options.length - 1] as HTMLElement
          ).focus()
        }
      })

      this.config.down = new KeyPressListener(
        'ArrowDown',
        () => {
          const current = Number(
            this.config.prevFocus?.getAttribute('data-button')
          )

          const nextButton = Array.from(
            this.element.querySelectorAll('button')
          ).find((el: HTMLElement) => {
            return (
              Number(el?.dataset['button']) > current &&
              el.dataset['disabled'] === 'false'
            )
          }) as HTMLElement | undefined

          if (nextButton) {
            nextButton.focus()
          } else {
            ;(
              this.element!.querySelector(
                'button[data-disabled="false"]'
              ) as HTMLElement
            ).focus()
          }
        }
      )

      this.resetFocus()
    }
  }

  end() {
    this.element.remove()
    this.descriptionElement.remove()

    this.config.up?.unbind()
    this.config.down?.unbind()
  }

  init(container: HTMLDivElement) {
    container.appendChild(this.element)

    const descriptionContainer =
      this.descriptionContainer || container

    descriptionContainer?.appendChild(this.descriptionElement)
  }

  setOptions(options: KeyboardMenuOption[]) {
    this.config.options = options
    this.element.options = options

    this.element.updateComplete.then(() => {
      console.log('COMPLETED')
    })

    this.element.requestUpdate()
  }
}
