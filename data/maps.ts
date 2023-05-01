import { GameMapConfig } from '@pl-types'
import demo from './demo'
import kitchen from './kitchen'

export type GameMaps = 'DemoRoom' | 'Kitchen'

const maps: Record<GameMaps, GameMapConfig> = {
  DemoRoom: demo,
  Kitchen: kitchen
}

export default maps
