import Overworld from "./overworld"

(() => {
    const ow = new Overworld({
        element: document.querySelector('.game-container')!
    })

    ow.init()
})()

export {}