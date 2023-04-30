import { ActionType } from '@/content/actions'
import { Behaviour, CombatantConfig } from 'types'
import Battle from './battle'
import Combatant from './combatant'

class TurnCycle {
  battle: Battle
  onNewEvent: (e: Behaviour) => Promise<{
    action: ActionType
    target: Combatant
    instanceId?: string
    replacement?: CombatantConfig
  }>
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

    if (!caster) return

    const target =
      caster.data.team === 'player'
        ? this.battle.activeCombatants['enemy']
        : this.battle.activeCombatants['player']

    if (!target) {
      return
    }

    const submission = await this.onNewEvent({
      type: 'submissionMenu',
      caster,
      target
    })

    if (submission.replacement) {
      console.log('REPLACING HEREEEE')

      await this.onNewEvent({
        type: 'replace',
        replacement: submission.replacement,
        team: caster.data.team
      })

      await this.onNewEvent({
        type: 'textMessage',
        text: `{{CASTER}} is replaced by {{TARGET}}`,
        caster: caster,
        target: this.battle.combatants[submission.replacement.id]
      })

      this.updateTeams()
      this.nextTurn()

      return
    }

    if (submission.instanceId) {
      this.battle.items = this.battle.items.filter(
        i => i.instanceId !== submission.instanceId
      )
    }
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

    // Did the target die?
    const targetDead = submission.target.data.hp <= 0

    if (targetDead) {
      await this.onNewEvent({
        type: 'textMessage',
        text: `{{TARGET}} died in battle to {{CASTER}}...`,
        caster,
        target: submission.target
      })

      if (submission.target.data.team === 'enemy') {
        await this.onNewEvent({
          type: 'textMessage',
          text: `${this.battle.activeCombatants['player']?.data.name} gained ${submission.target.givesXp} XP`
        })

        await this.onNewEvent({
          type: 'defeatFoe',
          xp: submission.target.givesXp,
          caster: this.battle.activeCombatants['player']!
        })
      }
      this.updateTeams()
    }

    // Do we have a winning team?
    const winner = this.getWinner()

    if (winner) {
      this.battle.activeCombatants[target.data.team] = null
      this.battle.combatants[target.data.id].updateInfo({})

      await this.onNewEvent({
        type: 'textMessage',
        text: `${caster.data.team} won the battle!`
      })
      this.updateTeams()
      return
    }

    // We have a dead target, but still no winner, so bring a replacement
    if (targetDead) {
      const { replacement } = await this.onNewEvent({
        type: 'replacementMenu',
        team: submission.target.data.team
      })

      await this.onNewEvent({
        type: 'replace',
        replacement: replacement,
        team: submission.target.data.team
      })

      if (!replacement) return
      await this.onNewEvent({
        type: 'textMessage',
        text: `{{CASTER}} is replaced by {{TARGET}}`,
        caster: target,
        target: this.battle.combatants[replacement.id]
      })

      this.updateTeams()
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

    this.updateTeams()
    this.nextTurn()
  }

  updateTeams() {
    this.battle.playerTeam.update()
    this.battle.enemyTeam.update()
  }

  getWinner() {
    let aliveTeams = {
      player: false,
      enemy: false
    }
    Object.values(this.battle.combatants).forEach(c => {
      console.log(c)
      if (c.data.hp > 0) {
        aliveTeams[c.data.team] = true
      }
    })

    if (!aliveTeams.player) {
      return 'enemy'
    } else if (!aliveTeams.enemy) {
      return 'player'
    } else {
      return null
    }
  }

  nextTurn() {
    this.currentTeam =
      this.currentTeam === 'player' ? 'enemy' : 'player'

    this.turn()
  }

  async init() {
    // await this.onNewEvent({
    //   type: 'textMessage',
    //   text: 'The Battle is starting'
    // })

    this.turn()
  }
}

export default TurnCycle
