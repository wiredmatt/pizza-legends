import { ActionType, Actions } from '@/content/actions'
import {
  CombatantConfig,
  KeyboardMenuOption,
  SubmissionMenuConfig
} from 'types'
import { KeyboardMenu } from './keyboard-menu'

class SubmissionMenu {
  config: SubmissionMenuConfig
  keyboardMenu: KeyboardMenu | null = null
  container?: HTMLDivElement
  items: {
    actionId: string
    quantity: number
    instanceId: string
  }[]

  constructor(config: SubmissionMenuConfig) {
    this.config = config

    let quantityMap: Record<
      string,
      { actionId: string; quantity: number; instanceId: string }
    > = {}

    config.items.forEach(item => {
      if (item.team === this.config.caster?.data.team) {
        if (quantityMap[item.actionId]) {
          quantityMap[item.actionId].quantity++
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId
          }
        }
      }
    })

    this.items = Object.values(quantityMap)
  }

  get pages() {
    const backOption = {
      label: 'Back',
      description: 'Go back to the previous menu',
      handler: () => {
        this.showMenu(this.container, this.pages.root)
      }
    }

    const replacements = [
      ...this.config.replacements.map(replacement => ({
        label: replacement.data.name,
        description: replacement.data.description,
        handler: () => {
          console.log('hehehe')
          this.menuSubmitReplacement(replacement.data)
        }
      }))
    ]

    if (this.config.replaceOnly) {
      return {
        root: [...replacements]
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
            this.showMenu(
              this.container,
              this.pages.replacements
            )
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
      items: [
        ...(this.items.map(item => ({
          label:
            Actions[item.actionId as keyof typeof Actions].name,
          description:
            Actions[item.actionId as keyof typeof Actions]
              .description || '',
          handler: () => {
            this.menuSubmit(
              Actions[item.actionId as keyof typeof Actions],
              item.instanceId
            )
          },
          right: () => `x${item.quantity}`
        })) || []),
        backOption
      ],
      replacements: [...replacements, backOption]
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

  menuSubmitReplacement(replacement: CombatantConfig) {
    this.keyboardMenu?.end()
    this.config.onComplete({
      replacement
    })
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
        : this.config.target,
      instanceId: instanceId
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
