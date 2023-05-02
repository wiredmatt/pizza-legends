import constants from '@/constants'
import GameObject from '@/game-object'
import Person from '@/person'
import utils from '@/utils'
import { GameMapConfig } from '@pl-types'
import personAnimations from './animations/person'

const gameObjects = new Map<string, GameObject>([
  [
    constants.HERO,
    new Person({
      x: utils.withGrid(5),
      y: utils.withGrid(6),
      src: constants.HERO_SPRITE,
      shadow: constants.SHADOW_SPRITE,
      isPlayerControlled: true,
      animations: personAnimations
    })
  ],
  [
    constants.NPC1,
    new Person({
      x: utils.withGrid(7),
      y: utils.withGrid(9),
      src: constants.NPC1_SPRITE,
      shadow: constants.SHADOW_SPRITE,
      animations: personAnimations,
      behaviourLoop: [
        {
          type: 'stand',
          direction: 'left',
          time: 800
        },
        {
          type: 'stand',
          direction: 'up',
          time: 800
        },
        {
          type: 'stand',
          direction: 'right',
          time: 1200
        },
        {
          type: 'stand',
          direction: 'up',
          time: 300
        }
      ],
      talking: [
        {
          requires: ['TALKED_TO_ERIO'],
          events: [
            {
              who: constants.NPC1,
              type: 'textMessage',
              text: "Isn't Erio the best?",
              trigger: constants.HERO
            }
          ]
        },
        {
          events: [
            {
              who: constants.NPC1,
              type: 'textMessage',
              text: "I'll slice you up!",
              trigger: constants.HERO
            },
            {
              type: 'battle',
              who: constants.NPC1,
              flag: 'DEFEATED_BETH'
            },
            {
              who: constants.NPC1,
              type: 'textMessage',
              text: 'Oh... I lost...',
              trigger: constants.HERO
            }
          ]
        }
      ]
    })
  ],
  [
    constants.NPC2,
    new Person({
      x: utils.withGrid(8),
      y: utils.withGrid(5),
      src: constants.NPC2_SPRITE,
      shadow: constants.SHADOW_SPRITE,
      animations: personAnimations,
      talking: [
        {
          events: [
            // {
            //   who: constants.NPC2,
            //   type: 'textMessage',
            //   text: "I'll slice you up!",
            //   trigger: constants.HERO
            // },
            // {
            //   type: 'battle',
            //   who: constants.NPC2
            // }
            {
              who: constants.NPC2,
              type: 'textMessage',
              text: "Bahaha! I'm the best!",
              trigger: constants.HERO,
              flag: 'TALKED_TO_ERIO'
            }
          ]
        }
      ]
      // behaviourLoop: [
      //   {
      //     type: 'walk',
      //     direction: 'left'
      //   },
      //   {
      //     type: 'stand',
      //     direction: 'up',
      //     time: 800
      //   },
      //   {
      //     type: 'walk',
      //     direction: 'up'
      //   },
      //   {
      //     type: 'walk',
      //     direction: 'right'
      //   },
      //   {
      //     type: 'walk',
      //     direction: 'down'
      //   }
      // ]
      // behaviourLoop: [{}]
    })
  ]
])

const map: GameMapConfig = {
  lowerSrc: constants.DEMO_LOWER_SPRITE,
  upperSrc: constants.DEMO_UPPER_SPRITE,
  gameObjects,
  walls: {
    [utils.asGridCoord(7, 6)]: true,
    [utils.asGridCoord(8, 6)]: true,
    [utils.asGridCoord(7, 7)]: true,
    [utils.asGridCoord(8, 7)]: true
  },
  cutsceneSpaces: {
    [utils.asGridCoord(7, 4)]: [
      {
        events: [
          {
            who: constants.NPC2,
            type: 'walk',
            direction: 'left'
          },
          {
            who: constants.NPC2,
            type: 'stand',
            direction: 'up',
            time: 500
          },
          {
            who: constants.NPC2,
            type: 'textMessage',
            text: "You can't be in there!"
          },
          {
            who: constants.NPC2,
            type: 'walk',
            direction: 'right'
          },
          {
            who: constants.HERO,
            type: 'walk',
            direction: 'down'
          },
          {
            who: constants.HERO,
            type: 'walk',
            direction: 'left'
          }
        ]
      }
    ],
    [utils.asGridCoord(5, 10)]: [
      {
        events: [
          {
            type: 'changeMap',
            map: 'Kitchen'
          }
        ]
      }
    ]
  }
}

export default map
