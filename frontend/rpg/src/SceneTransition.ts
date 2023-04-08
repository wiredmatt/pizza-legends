import { html, LitElement, PropertyValueMap } from 'lit'

export class LitScene extends LitElement {
  onElementReady: (element?: HTMLDivElement) => void

  constructor(onElementReady: (div?: HTMLDivElement) => void) {
    super()
    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`<div class="scene-transition fade-in"></div>`
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

class SceneTransition {
  element: LitScene
  callback?: () => void

  onElementReady = (element?: HTMLDivElement) => {
    element?.addEventListener(
      'animationend',
      () => {
        if (this.callback) {
          this.callback()
        }
      },
      {
        once: true
      }
    )
  }

  fadeOut() {
    this.element.getDivElement()?.addEventListener(
      'animationend',
      () => {
        this.element.remove()
      },
      {
        once: true
      }
    )

    this.element.getDivElement()?.classList.add('fade-out')
  }

  constructor() {
    this.callback = undefined
    this.element = new LitScene(e => {
      this.onElementReady(e)
    })
  }

  init(container: HTMLDivElement, callback: () => void) {
    this.callback = callback
    container.appendChild(this.element)
  }
}

export default SceneTransition
