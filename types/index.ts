import { BattleAnimations } from '@/battle/battle-animations'
import Combatant from '@/battle/combatant'
import { ActionItems, ActionType } from '@/content/actions'
import { Pizzas, PizzasTypes } from '@/content/pizzas'
import GameMap from '@/game-map'
import GameObject from '@/game-object'
import KeyPressListener from '@/key-press-listener'
import { GameMaps } from 'data/maps'

type OwConfig = {
  element: HTMLElement | null
  map?: GameMap | null
}

type SpriteConfig = {
  src: string
  shadow?: string
  animations?: { [key: string]: [number, number][] }
  currentAnimation?: string
  currentAnimationFrame?: number
  animationFrameLimit?: number
  gameObject?: GameObject
}

type Direction = 'down' | 'up' | 'left' | 'right'

type DirectionUpdate = Record<string, ['x' | 'y', number]>

type GameObjectConfig = {
  x: number
  y: number
  direction?: Direction
  src?: string
  shadow?: string
  isPlayerControlled?: boolean
  animations?: { [key: string]: [number, number][] }
  behaviourLoop?: Behaviour[]
  talking?: Talking
  pizzas?: (keyof typeof Pizzas)[]
}

type GameObjectState = {
  direction?: Direction
  map?: GameMap | null
}

type CutsceneSpaces = {
  [key: string]: {
    events: Behaviour[]
  }[]
}

type GameMapConfig = {
  gameObjects: Map<string, GameObject>
  lowerSrc: string
  upperSrc: string
  walls?: Record<string, boolean>
  cutsceneSpaces?: CutsceneSpaces
}

type GameEventConfig = {
  map: GameMap
  event: Behaviour
}

type KeyMap = Record<KeyboardEvent['key'], Direction>

type Animations<T> = {
  [key in keyof T]: [number, number][]
}

type PersonAnimations = Animations<{
  idleDown: [[number, number]]
  idleRight: [[number, number]]
  idleLeft: [[number, number]]
  idleUp: [[number, number]]
  walkDown: [[number, number]]
  walkUp: [[number, number]]
  walkLeft: [[number, number]]
  walkRight: [[number, number]]
}>

type BehaviourType =
  | 'stand'
  | 'walk'
  | 'textMessage'
  | 'changeMap'
  | 'battle'

type Status = {
  type: 'saucy' | 'burnt' | 'poisoned' | string
  expiresIn: number
} | null

type Behaviour = {
  type: BehaviourType | string
  direction?: Direction
  time?: number
  who?: string
  retry?: boolean
  text?: string
  trigger?: string // id of the gameObject to face
  map?: GameMaps // id of the gameMap to change to
  caster?: Combatant
  target?: Combatant
  damage?: number
  recover?: number
  animation?: keyof typeof BattleAnimations
  statusOnCaster?: boolean
  status?: Status
  action?: ActionType
  color?: string
  replacement?: CombatantConfig
  team?: string
  xp?: number
  flag?: string
  // keys of Pizzas
  pizzas?: (keyof typeof Pizzas)[]
  x?: number
  y?: number
}

type Talking = {
  requires?: string[]
  events: Behaviour[]
}[]

type CombatantConfig = {
  name: string
  description?: string
  type: PizzasTypes
  src: string
  icon?: string
  team: 'player' | 'enemy'
  hp?: number
  maxHp: number
  xp?: number
  maxXp?: number
  level: number
  status?: Status
  id: string
  actions: ActionType[]
}

type SubmissionMenuConfig = {
  caster?: Combatant
  target?: Combatant
  onComplete: (sub: {
    action?: ActionType
    target?: Combatant
    instanceId?: string
    replacement?: CombatantConfig
  }) => void
  items: {
    actionId: keyof ActionItems
    instanceId: string
    team: 'player' | 'enemy'
  }[]
  replacements: Combatant[]
  replaceOnly?: boolean
}

type KeyboardMenuOption = {
  label: string
  description: string
  handler: () => void
  right?: () => string
  disabled?: boolean
}

type KeyboardMenuConfig = {
  options: KeyboardMenuOption[]
  up?: KeyPressListener
  down?: KeyPressListener
  prevFocus?: HTMLButtonElement | null
}

type ProgressConfig = {
  mapId: GameMaps
  x: number
  y: number
  direction: Direction
  saveFileKey: string
}

export type {
  Animations,
  Behaviour,
  BehaviourType,
  CombatantConfig,
  CutsceneSpaces,
  Direction,
  DirectionUpdate,
  GameEventConfig,
  GameMapConfig,
  GameObjectConfig,
  GameObjectState,
  KeyMap,
  KeyboardMenuConfig,
  KeyboardMenuOption,
  OwConfig,
  PersonAnimations,
  ProgressConfig,
  SpriteConfig,
  SubmissionMenuConfig,
  Talking
}
// T = 'idleDown' | 'idleRight' | 'idleLeft' | 'idleUp' | 'walkDown' | 'walkUp' | 'walkLeft' | 'walkRight'
// type SpriteConfig<T> = {
//   src: string
//   shadow?: string
//   animations?: { [key in keyof T]: [number, number][] }
//   currentAnimation?: string
//   currentAnimationFrame?: number
//   animationFrameLimit?: number
//   gameObject?: GameObject
// }
