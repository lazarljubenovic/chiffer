export type Pattern = ReadonlyArray<ReadonlyArray<string>>

export const binary: Pattern = [
  ['0', '1']
]

export const ternary: Pattern = [
  ['0', '1', '2']
]

export const octal: Pattern = [
  ['0', '1', '2', '3', '4', '5', '6', '7'],
]

export const nonary: Pattern = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
]

export const hexadecimal: Pattern = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
]

export const hexadecimalLowercase: Pattern = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
]
