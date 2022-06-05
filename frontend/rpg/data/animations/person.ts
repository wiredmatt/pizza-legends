const animations: PersonAnimations = {
  idleDown: [[0, 0]],
  idleRight: [[0, 1]],
  idleUp: [[0, 2]],
  idleLeft: [[0, 3]],
  walkDown: [
    [1, 0],
    [0, 0],
    [3, 0],
    [0, 0]
  ],
  walkRight: [
    [1, 1],
    [0, 1],
    [3, 1],
    [0, 1]
  ],
  walkUp: [
    [1, 2],
    [0, 2],
    [3, 2],
    [0, 2]
  ],
  walkLeft: [
    [1, 3],
    [0, 3],
    [3, 3],
    [0, 3]
  ]
}

export default animations
