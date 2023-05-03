class KeyPressListener {
  keysafe = true
  keyDownFunction: (e: KeyboardEvent) => void
  keyUpFunction: (e: KeyboardEvent) => void

  constructor(keyCode: string, callback: () => void) {
    this.keyDownFunction = event => {
      if (event.code === keyCode && this.keysafe) {
        this.keysafe = false
        callback()
      }
    }

    this.keyUpFunction = event => {
      if (event.code === keyCode) {
        this.keysafe = true
      }
    }

    document.addEventListener('keydown', this.keyDownFunction)
    document.addEventListener('keyup', this.keyUpFunction)
  }

  unbind() {
    document.removeEventListener('keydown', this.keyDownFunction)
    document.removeEventListener('keyup', this.keyUpFunction)
    console.log('unbind')
  }
}

export default KeyPressListener
