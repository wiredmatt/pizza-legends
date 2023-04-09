import { BattleAnimations } from '@/battle/battle-animations'
import Combatant from '@/battle/combatant'
import { ActionType } from '@/content/actions'
import { PizzasTypes } from '@/content/pizzas'
import GameMap from '@/gameMap'
import GameObject from '@/gameObject'
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
  animation?: keyof typeof BattleAnimations
}

type Talking = {
  events: Behaviour[]
}[]

type CombatantConfig = {
  name: string
  type: PizzasTypes
  src: string
  icon: string
  team: 'player' | 'enemy'
  hp: number
  maxHp: number
  xp: number
  maxXp: number
  level: number
  status: any
  id: string
  actions: ActionType[]
}

type SubmissionMenuConfig = {
  caster?: Combatant
  target?: Combatant
  onComplete: (sub: {
    action: ActionType
    target: Combatant
  }) => void
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
  OwConfig,
  PersonAnimations,
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
