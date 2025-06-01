export const moodToText = (value: string) => {
    switch (value) {
      case 'VERY_SAD':
        return 'Very Sad'

      case 'SAD':
        return 'Sad'

      case 'NEUTRAL':
        return 'Neutral'

      case 'HAPPY':
        return 'Happy'

      case 'VERY_HAPPY':
        return 'Very Happy'

      default:
        return 'Neutral'
    }
}

export const moodToImage = (value: string) => {
    switch (value) {
      case 'VERY_SAD':
        return require('../assets/images/very_sad.png')

      case 'SAD':
        return require('../assets/images/sad.png')

      case 'NEUTRAL':
        return require('../assets/images/neutral.png')

      case 'HAPPY':
        return require('../assets/images/happy.png')

      case 'VERY_HAPPY':
        return require('../assets/images/very_happy.png')

      default:
        return require('../assets/images/neutral.png')
    }
}

export const sleepToText = (value: string) => {
    switch (value) {
      case 'ZERO_TWO':
        return '0 - 2'

      case 'THREE_FOUR':
        return '3 - 4'

      case 'FIVE_SIX':
        return '5 - 6'

      case 'SEVEN_EIGHT':
        return '7 - 8'

      case 'NINE':
        return '+9'

      default:
        return '0 - 2'
    }
}