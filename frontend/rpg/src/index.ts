import logger from '@logger'
import Overworld from './overworld'

declare global {
  interface GlobalEventHandlersEventMap {
    personWalkingComplete: CustomEvent<{ who: string }>
    personStandingComplete: CustomEvent<{ who: string }>
  }
}

const main = () => {
  const ow = new Overworld({
    element: document.querySelector('.game-container')
  })

  logger.setup()

  ow.init()
}

main()
