import { Pattern } from './patterns'

export interface DecodeConfig {
  pattern: Pattern
}

export function decode (encoded: string | Array<string>, config: DecodeConfig): number {
  let result: number = 0
  let patternIndex: number = 0
  let multiplier: number = 1
  for (let i = encoded.length - 1; i >= 0; i--) {
    const value = config.pattern[patternIndex].indexOf(encoded[i])
    result += value * multiplier
    const nextPatternIndex = (patternIndex + 1) % config.pattern.length
    if (patternIndex == 0) {
      multiplier *= config.pattern[patternIndex].length
    }
    patternIndex = nextPatternIndex
  }
  return result
}
