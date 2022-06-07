import { html, LitElement } from 'lit'
import KeyPressListener from './keyPressListener'

export class LitTextMessage extends LitElement {
  text: string
  done: () => void

  constructor(text: string, done: () => void) {
    super()
    this.text = text
    this.done = done
  }

  render() {
    return html`
      <style>
        div {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 36px;
          padding: 4px;
          background: #ffe8d2;
          border-top: 1px solid #a48465;
          color: #3a160d;
        }
        p {
          margin: 0;
          font-size: 12px;
        }
        button {
          margin: 0;
          font-size: 8px;
          padding: 2px;
          -webkit-appearance: none;
          background: none;
          border: 1px solid;
          font-family: inherit;
          cursor: pointer;

          position: absolute;

          right: 2px;
          bottom: 0;
        }
      </style>
      <div>
        <p>${this.text}</p>
        <button @click="${() => this.done()}">Next</button>
      </div>
    `
  }
}

class TextMessage {
  text: string
  element: LitTextMessage
  onComplete: () => void
  actionListener: KeyPressListener

  constructor({
    text,
    onComplete
  }: {
    text: string
    onComplete: () => void
  }) {
    this.text = text
    this.onComplete = onComplete

    this.element = new LitTextMessage(this.text, () => {
      this.done()
    })

    this.actionListener = new KeyPressListener('Enter', () => {
      this.actionListener.unbind()
      this.done()
    })
  }

  init(container: HTMLDivElement) {
    container.appendChild(this.element)
  }

  done() {
    this.element.remove()
    this.onComplete()
  }
}

export default TextMessage
