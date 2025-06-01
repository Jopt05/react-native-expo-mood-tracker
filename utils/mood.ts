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

export const moodToNumber = (value: string) => {
    switch (value) {
      case 'VERY_SAD':
        return 1

      case 'SAD':
        return 2

      case 'NEUTRAL':
        return 3

      case 'HAPPY':
        return 4

      case 'VERY_HAPPY':
        return 5

      default:
        return 3
    }
}

export const sleepToNumber = (value: string) => {
    switch (value) {
      case 'ZERO_TWO':
        return 1

      case 'THREE_FOUR':
        return 2

      case 'FIVE_SIX':
        return 3

      case 'SEVEN_EIGHT':
        return 4

      case 'NINE':
        return 5

      default:
        return 1
    }
}

export const numberToSleep = (value: number) => {
    switch (value) {
      case 1:
        return '0-2 hours'

      case 2:
        return '3-4 hours'

      case 3:
        return '5-6 hours'

      case 4:
        return '7-8 hours'

      case 5:
        return '+9 hours'

      default:
        return '0-2 hours'
    }
}

export const numberToMood = (value: number) => {
    switch (value) {
      case 1:
        return 'VERY_SAD'

      case 2:
        return 'SAD'

      case 3:
        return 'NEUTRAL'

      case 4:
        return 'HAPPY'

      case 5:
        return 'VERY_HAPPY'

      default:
        return 'NEUTRAL'
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

export const formatMoodToChartColor = (mood: string) => {
  switch (mood) {
    case 'VERY_SAD':
      return '#ff9b99'

    case 'SAD':
      return '#b8b1ff'

    case 'NEUTRAL':
      return '#87c9fc'

    case 'HAPPY':
      return '#88e77f'

    case 'VERY_HAPPY':
      return '#fec97b'

    default:
      return 'red'
  }
}