import { Enemy } from '@/content/enemies'
import { PlayerState } from '@/state/player-state'

export {}

declare global {
  var playerState: PlayerState | null
  var enemies: { [key: string]: Enemy }
}
