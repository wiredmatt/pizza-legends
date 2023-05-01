import { html, LitElement, PropertyValueMap } from 'lit'
import KeyPressListener from './key-press-listener'
import { RevealingText } from './revaling-text'

export class LitTextMessage extends LitElement {
  text: string
  done: () => void
  onElementReady: (element?: HTMLParagraphElement) => void

  constructor(
    text: string,
    done: () => void,
    onElementReady: (p?: HTMLParagraphElement) => void
  ) {
    super()
    this.text = text
    this.done = done
    this.onElementReady = onElementReady
  }

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <div class="text-message-container">
        <p></p>
        <button @click="${() => this.done()}">Next</button>
      </div>
    `
  }

  protected firstUpdated(
    _changedProperties:
      | PropertyValueMap<unknown>
      | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties)

    this.onElementReady(this.getParagraphElement())
  }

  getParagraphElement() {
    return this.querySelector('p') || undefined
  }
}

class TextMessage {
  text: string
  element: LitTextMessage
  onComplete: () => void
  actionListener: KeyPressListener
  revealingText?: RevealingText

  onElementReady = (element?: HTMLParagraphElement) => {
    console.log(element)
    this.revealingText = new RevealingText({
      element: element,
      text: this.text,
      speed: 50
    })
    this.revealingText.init()
  }

  constructor({
    text,
    onComplete
  }: {
    text: string
    onComplete: () => void
  }) {
    this.text = text
    this.onComplete = onComplete

    this.element = new LitTextMessage(
      this.text,
      () => {
        this.done()
      },
      e => {
        this.onElementReady(e)
      }
    )

    this.actionListener = new KeyPressListener('Enter', () => {
      this.done()
    })
  }

  init(container: HTMLDivElement) {
    container.appendChild(this.element)
  }

  done() {
    if (!this.revealingText?.isDone) {
      this.revealingText?.skip()
    } else {
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete()
    }
  }
}

export default TextMessage
