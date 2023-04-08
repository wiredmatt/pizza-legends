import logger from '@logger'
import { LitScene } from './SceneTransition'
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

const main = () => {
  const ow = new Overworld({
    element: document.querySelector('.game-container')
  })

  logger.setup()

  ow.init()
}

main()
