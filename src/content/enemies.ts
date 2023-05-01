import { CombatantConfig } from '@pl-types'
import { Pizzas } from './pizzas'

export type Enemy = {
  name: string
  src: string
  pizzas: EnemyPizzas
}

export type EnemyPizzas = {
  [key: string]: CombatantConfig
}

export const enemies = {
  erio: {
    name: 'Erio',
    src: '/images/characters/people/erio.png',
    pizzas: {
      a: {
        ...Pizzas['v001'],
        team: 'enemy' as 'enemy',
        hp: 10,
        maxHp: 50,
        xp: 10,
        maxXp: 100,
        level: 1,
        status: null,
        id: 'a'
      },
      b: {
        ...Pizzas['f001'],
        team: 'enemy' as 'enemy',
        hp: 10,
        maxHp: 50,
        xp: 30,
        maxXp: 100,
        level: 1,
        status: null,
        id: 'b'
      }
    }
  },
  beth: {
    name: 'Beth',
    src: '/images/characters/people/npc1.png',
    pizzas: {
      a: {
        ...Pizzas['f001'],
        team: 'enemy' as 'enemy',
        hp: 10,
        maxHp: 50,
        xp: 20,
        maxXp: 100,
        level: 1,
        status: null,
        id: 'a'
      }
    }
  }
}
