type RevealingCharacters = {
  span: HTMLSpanElement
  delayAfter: number
}[]

export class RevealingText {
  element?: HTMLParagraphElement
  text: string
  speed: number
  timeout: number | null
  isDone: boolean

  constructor(config: {
    element?: HTMLParagraphElement
    text: string
    speed: number
  }) {
    this.element = config.element
    this.text = config.text
    this.speed = config.speed || 50
    this.timeout = null
    this.isDone = false
  }

  revealOneCharacter(characters: RevealingCharacters) {
    const next = characters.splice(0, 1)[0]

    next.span.classList.add('revealed')

    if (characters.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(characters)
      }, next.delayAfter)
    } else {
      this.isDone = true
    }
  }

  skip() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    if (!this.isDone) {
      this.element?.querySelectorAll('span').forEach(span => {
        span.classList.add('revealed')
      })
      this.isDone = true
    }
  }

  init() {
    const characters: RevealingCharacters = []

    this.text.split('').forEach(char => {
      const span = document.createElement('span')
      span.textContent = char
      this.element?.appendChild(span)

      characters.push({
        span,
        delayAfter: char === ' ' ? 0 : this.speed
      })
    })

    this.revealOneCharacter(characters)
  }
}
