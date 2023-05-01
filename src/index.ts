import { LitBattle } from './battle/battle'
import { LitCombatantHUD, LitPizza } from './battle/combatant'
import { LitDescription, LitMenu } from './battle/keyboard-menu'
import { LitTeam } from './battle/team'
import { enemies } from './content/enemies'
import { LitHUD } from './hud'
import Overworld from './overworld'
import { LitPauseMenu } from './pause-menu'
import { LitScene } from './scene-transition'
import { PlayerState } from './state/player-state'
import { LitTextMessage } from './text-message'

declare global {
  interface GlobalEventHandlersEventMap {
    personWalkingComplete: CustomEvent<{ who: string }>
    personStandingComplete: CustomEvent<{ who: string }>
    playerStateUpdated: CustomEvent<{}>
    lineupChange: CustomEvent<{}>
  }
}

customElements.define('text-message', LitTextMessage)
customElements.define('pl-transition', LitScene)
customElements.define('pl-battle', LitBattle)
customElements.define('pl-combatant-hud', LitCombatantHUD)
customElements.define('pl-pizza', LitPizza)
customElements.define('pl-menu', LitMenu)
customElements.define('pl-description', LitDescription)
customElements.define('pl-team', LitTeam)
customElements.define('pl-ow-hud', LitHUD)
customElements.define('pl-pause-menu', LitPauseMenu)

const main = () => {
  const ow = new Overworld({
    element: document.querySelector('.game-container')
  })

  globalThis.playerState = new PlayerState()
  globalThis.enemies = enemies

  ow.init()
}

main()
