import GameObject from '@/gameObject'

type OwConfig = {
  element: HTMLElement | null
}

type SpriteConfig = {
  src: string
  shadow?: string
  animations?: object
  currentAnimation?: string
  currentAnimationFrame?: number
  gameObject: GameObject
}

type GameObjectConfig = {
  src?: string
  shadow?: string
  x: number
  y: number
}

export type { OwConfig, SpriteConfig, GameObjectConfig }
