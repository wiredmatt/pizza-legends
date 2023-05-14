import demo from './demo'
import kitchen from './kitchen'
import street from './street'

const maps = {
  DemoRoom: demo,
  Kitchen: kitchen,
  Street: street
}

export type GameMaps = keyof typeof maps

export default maps
