import { SubmissionMenuConfig } from 'types'

class SubmissionMenu {
  config: SubmissionMenuConfig

  constructor(config: SubmissionMenuConfig) {
    this.config = config
  }

  decide() {
    if (!this.config.target) {
      console.log('no target')
      return
    }

    this.config.onComplete({
      action: this.config.caster!.data.actions[0],
      target: this.config.target
    })
  }

  init(container: HTMLDivElement) {
    this.decide()
  }
}

export default SubmissionMenu
