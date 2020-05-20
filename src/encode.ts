import { BadPatternError } from './errors'
import { Pattern } from './patterns'

export interface EncodeConfig {
  pattern: Pattern
  padding?: number
  resultAsArray?: boolean
}

interface EncodeConfig_ResultAsArrayGeneric<T> {
  pattern: Pattern
  padding?: number
  resultAsArray: T
}


export function encode (
  number: number,
  config: EncodeConfig_ResultAsArrayGeneric<false>,
): string
export function encode (
  number: number,
  config: EncodeConfig_ResultAsArrayGeneric<true>,
): Array<string>
export function encode (
  number: number,
  config: Omit<EncodeConfig, 'resultAsArray'>
): string
export function encode (
  number: number,
  config: EncodeConfig,
): string | Array<string> {
  if (config.pattern.length == 0 || config.pattern.some(symbols => symbols.length == 0) || config.pattern.some(symbols => symbols.some(symbol => symbol.length == 0))) {
    throw new BadPatternError(config.pattern)
  }
  let result: Array<string> = []
  let patternIndex: number = 0

  while (true) {
    // dividend = divisor * quotient + remainder
    const divisor = config.pattern[patternIndex].length
    const quotient = Math.floor(number / divisor)
    const remainder = number - quotient * divisor
    const newSymbol = config.pattern[patternIndex][remainder]
    result.unshift(newSymbol)
    number = quotient
    patternIndex = (patternIndex + 1) % config.pattern.length
    if (number == 0) break
  }

  // padding
  if (config.padding != null) {
    let symbolsLeftCount: number = config.padding - result.length
    for (let i = 0; i < symbolsLeftCount; i++) {
      const newSymbol = config.pattern[patternIndex][0]
      result.unshift(newSymbol)
      patternIndex = (patternIndex + 1) % config.pattern[patternIndex].length
    }
  }

  return config.resultAsArray ? result : result.join('')
}
