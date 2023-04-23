import { ActionType } from '@/content/actions'
import { KeyboardMenuOption, SubmissionMenuConfig } from 'types'
import { KeyboardMenu } from './keyboard-menu'

class SubmissionMenu {
  config: SubmissionMenuConfig
  keyboardMenu: KeyboardMenu | null = null
  container?: HTMLDivElement

  constructor(config: SubmissionMenuConfig) {
    this.config = config
  }

  get pages() {
    const backOption = {
      label: 'Back',
      description: 'Go back to the previous menu',
      handler: () => {
        this.showMenu(this.container, this.pages.root)
      }
    }

    return {
      root: [
        {
          label: 'Attack',
          description: 'Choose an attack to use',
          handler: () => {
            console.log('go to attacks')
            this.showMenu(this.container, this.pages.attacks)
          }
        },
        {
          label: 'Items',
          description: 'Choose an item to use',
          handler: () => {
            // Go to items page
            console.log('go to items')
            this.showMenu(this.container, this.pages.items)
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
          description: action.description || '',
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

  showMenu(
    container?: HTMLDivElement,
    options: KeyboardMenuOption[] = this.pages.root
  ) {
    this.keyboardMenu?.end() // End the previous menu

    this.keyboardMenu = new KeyboardMenu({
      options: options
    })

    this.keyboardMenu.init(container)
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

  init(container?: HTMLDivElement) {
    this.container = container
    if (this.config.caster?.data.team === 'player') {
      // Show UI for choosing the move to use
      this.showMenu(container)
    } else {
      this.decide()
    }
  }
}

export default SubmissionMenu
