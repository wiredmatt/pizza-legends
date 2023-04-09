import { ActionType } from '@/content/actions'
import { Behaviour } from 'types'
import Battle from './battle'
import Combatant from './combatant'

class TurnCycle {
  battle: Battle
  onNewEvent: (
    e: Behaviour
  ) => Promise<{ action: ActionType; target: Combatant }>
  currentTeam: 'player' | 'enemy' = 'player'

  constructor(
    battle: Battle,
    onNewEvent: (
      e: Behaviour
    ) => Promise<{ action: ActionType; target: Combatant }>
  ) {
    this.battle = battle
    this.onNewEvent = onNewEvent
  }

  async turn() {
    const caster = this.battle.activeCombatants[this.currentTeam]
    const target =
      caster.data.team === 'player'
        ? this.battle.activeCombatants['enemy']
        : this.battle.activeCombatants['player']

    const submission = await this.onNewEvent({
      type: 'submissionMenu',
      caster,
      target
    })

    const resultingEvents = caster.getReplacedEvents(
      submission.action.success
    )

    for (const ev of resultingEvents) {
      const event = {
        ...ev,
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }

    const postEvents = caster.getPostEvents()
    for (const ev of postEvents) {
      const event = {
        ...ev,
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }

    const expiredEvent = caster.decrementStatus()
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }

    this.currentTeam =
      this.currentTeam === 'player' ? 'enemy' : 'player'

    this.turn()
  }

  async init() {
    await this.onNewEvent({
      type: 'textMessage',
      text: 'The Battle is starting'
    })

    this.turn()
  }
}

export default TurnCycle
