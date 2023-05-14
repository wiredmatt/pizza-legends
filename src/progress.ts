import { ProgressConfig } from 'types'
import GameObject from './game-object'
import Person from './person'

export class Progress {
  config: ProgressConfig
  getHero: () => GameObject | Person | undefined

  constructor(
    config: ProgressConfig,
    getHero: () => GameObject | Person | undefined
  ) {
    this.config = config
    this.getHero = getHero
  }

  save() {
    const playerPos = this.getHero()?.position

    window.localStorage.setItem(
      this.config.saveFileKey,
      JSON.stringify({
        ...this.config,
        playerState: globalThis.playerState,
        ...playerPos
      })
    )
  }

  load() {
    const saveFile = window.localStorage.getItem(
      this.config.saveFileKey
    )

    if (!saveFile) return false

    const saveFileJson = JSON.parse(saveFile)
    const { playerState, ...rest } = saveFileJson

    globalThis.playerState = playerState
    this.config = rest

    return true
  }
}
