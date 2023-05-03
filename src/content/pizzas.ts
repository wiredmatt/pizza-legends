import { ActionType, Actions } from './actions'

const PizzasT: {
  [x: string]: 'normal' | 'spicy' | 'veggie' | 'fungi' | 'chill'
} = {
  normal: 'normal',
  spicy: 'spicy',
  veggie: 'veggie',
  fungi: 'fungi',
  chill: 'chill'
}

export type PizzasTypes = typeof PizzasT[keyof typeof PizzasT]

export type PizzaData = {
  name: string
  description: string
  type: PizzasTypes
  src: string
  icon: string
  actions: ActionType[]
}

export const Pizzas = {
  s001: {
    name: 'Slice Samurai',
    description: 'Something',
    type: 'spicy' as PizzasTypes,
    src: '/images/characters/pizzas/s001.png',
    icon: '/images/icons/spicy.png',
    actions: [
      // Actions.saucyStatus,
      Actions.clumsyStatus,
      Actions.damage1
    ],
    hp: 100,
    maxHp: 100
  },
  s002: {
    name: 'Bacon Brigade',
    description: 'Something',
    type: 'spicy' as PizzasTypes,
    src: '/images/characters/pizzas/s002.png',
    icon: '/images/icons/spicy.png',
    actions: [
      // Actions.saucyStatus,
      Actions.clumsyStatus,
      Actions.damage1
    ],
    hp: 100,
    maxHp: 100
  },
  v001: {
    name: 'Call Me Kalle',
    description: 'Something',
    type: 'veggie' as PizzasTypes,
    src: '/images/characters/pizzas/v001.png',
    icon: '/images/icons/veggie.png',
    actions: [Actions.damage1],
    hp: 100,
    maxHp: 100
  },
  f001: {
    name: 'Portobello Express',
    description: 'Something',
    type: 'fungi' as PizzasTypes,
    src: '/images/characters/pizzas/f001.png',
    icon: '/images/icons/fungi.png',
    actions: [Actions.damage1],
    hp: 100,
    maxHp: 100
  }
}
