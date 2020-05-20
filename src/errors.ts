import { Pattern } from './patterns'

export class BadPatternError extends Error {

  public constructor (
    public readonly givenPattern: Pattern,
  ) {
    super(`The pattern must be a non-empty array consisting of non-empty arrays consisting of non-empty strings.`)
  }

}
