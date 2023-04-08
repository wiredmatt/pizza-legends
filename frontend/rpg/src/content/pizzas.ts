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

export const Pizzas = {
  s001: {
    name: 'Slice Samurai',
    type: 'spicy' as PizzasTypes,
    src: '/images/characters/pizzas/s001.png',
    icon: '/images/icons/spicy.png'
  },
  v001: {
    name: 'Call Me Kalle',
    type: 'veggie' as PizzasTypes,
    src: '/images/characters/pizzas/v001.png',
    icon: '/images/icons/veggie.png'
  },
  f001: {
    name: 'Portobello Express',
    type: 'fungi' as PizzasTypes,
    src: '/images/characters/pizzas/f001.png',
    icon: '/images/icons/fungi.png'
  }
}
