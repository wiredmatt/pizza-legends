import logger from '@logger'
import { LitScene } from './SceneTransition'
import { LitBattle } from './battle/battle'
import { LitCombatantHUD, LitPizza } from './battle/combatant'
import { LitDescription, LitMenu } from './battle/keyboard-menu'
import Overworld from './overworld'
import { LitTextMessage } from './textMessage'

declare global {
  interface GlobalEventHandlersEventMap {
    personWalkingComplete: CustomEvent<{ who: string }>
    personStandingComplete: CustomEvent<{ who: string }>
  }
}

customElements.define('text-message', LitTextMessage)
customElements.define('pl-transition', LitScene)
customElements.define('pl-battle', LitBattle)
customElements.define('pl-combatant-hud', LitCombatantHUD)
customElements.define('pl-pizza', LitPizza)
customElements.define('pl-menu', LitMenu)
customElements.define('pl-description', LitDescription)

const main = () => {
  const ow = new Overworld({
    element: document.querySelector('.game-container')
  })

  logger.setup()

  ow.init()
}

main()
