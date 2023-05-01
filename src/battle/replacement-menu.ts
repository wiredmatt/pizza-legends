import { CombatantConfig } from 'types'
import Combatant from './combatant'
import { KeyboardMenu } from './keyboard-menu'

type ReplacementMenuConfig = {
  replacements: Combatant[]
  onComplete: (replacement: CombatantConfig) => {
    replacement: CombatantConfig
  }
}

class ReplacementMenu {
  config: ReplacementMenuConfig
  keyboardMenu?: KeyboardMenu

  constructor(config: ReplacementMenuConfig) {
    this.config = config
  }

  init(container: HTMLDivElement) {
    if (!this.config.replacements.length) {
      return
    }

    if (this.config.replacements[0].data.team === 'enemy') {
      this.decide()
    } else {
      this.showMenu(container)
    }
  }

  showMenu(container?: HTMLDivElement) {
    this.keyboardMenu?.end() // End the previous menu

    this.keyboardMenu = new KeyboardMenu({
      options: this.config.replacements.map(replacement => ({
        label: replacement.data.name,
        description: replacement.data.name,
        handler: () => {
          this.menuSubmit(replacement)
        }
      }))
    })
    this.keyboardMenu.init(container)
  }

  menuSubmit(replacement: Combatant) {
    this.keyboardMenu?.end() // End the previous menu
    console.log(replacement)
    this.config.onComplete(replacement.data)
  }

  decide() {
    this.menuSubmit(this.config.replacements[0])
  }
}

export default ReplacementMenu
