import { OwConfig } from "@pl-types";

class Overworld {
    element: HTMLElement
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(config: OwConfig){
        this.element = config.element
        this.canvas = this.element.querySelector('.game-canvas')!
        this.ctx = this.canvas.getContext('2d')!
    }

    init() {
        console.log('hello from the overworld', this)
    }
}

export default Overworld