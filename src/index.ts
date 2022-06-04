import Overworld from './overworld'

const main = () => {
  const ow = new Overworld({
    element: document.querySelector('.game-container')
  })

  ow.init()
}

main()
