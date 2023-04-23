import { ActionType } from '@/content/actions'
import { SubmissionMenuConfig } from 'types'
import { KeyboardMenu } from './keyboard-menu'

class SubmissionMenu {
  config: SubmissionMenuConfig
  keyboardMenu: KeyboardMenu | null = null

  constructor(config: SubmissionMenuConfig) {
    this.config = config
  }

  get pages() {
    const backOption = {
      label: 'Back',
      description: 'Go back to the previous menu',
      handler: () => {
        this.keyboardMenu?.setOptions(this.pages.root)
      }
    }

    return {
      root: [
        {
          label: 'Attack',
          description: 'Choose an attack to use',
          handler: () => {
            console.log('go to attacks')
            this.keyboardMenu?.setOptions(this.pages.attacks)
          }
        },
        {
          label: 'Items',
          description: 'Choose an item to use',
          handler: () => {
            // Go to items page
            console.log('go to items')
            this.keyboardMenu?.setOptions(this.pages.items)
          },
          disabled: false
        },
        {
          label: 'Swap',
          description: 'Change to another pizza',
          handler: () => {
            // See pizza options
            console.log('swap')
          }
        }
      ],
      attacks: [
        ...(this.config.caster?.data.actions.map(action => ({
          label: action.name,
          description: '',
          handler: () => {
            this.menuSubmit(action)
          }
        })) || []),
        backOption
      ],
      items: [backOption]
    }
  }

  // TODO: enemies should randomly decide what to do
  decide() {
    if (!this.config.caster?.data.actions.length) {
      return
    }

    this.menuSubmit(this.config.caster?.data.actions[0])
  }

  showMenu(container: HTMLDivElement) {
    this.keyboardMenu = new KeyboardMenu({
      options: this.pages.root
    })

    this.keyboardMenu.init(container)

    this.keyboardMenu.setOptions(this.pages.root)
  }

  menuSubmit(action: ActionType, instanceId?: string) {
    if (!this.config.target) {
      console.log('no target')
      return
    }

    this.keyboardMenu?.end()

    this.config.onComplete({
      action: action,
      target: action.statusOnCaster
        ? this.config.caster!
        : this.config.target
    })
  }

  init(container: HTMLDivElement) {
    if (this.config.caster?.data.team === 'player') {
      // Show UI for choosing the move to use
      this.showMenu(container)
    } else {
      this.decide()
    }
  }
}

export default SubmissionMenu
