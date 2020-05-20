# Chiffer

Encode and decode numbers into a different numeral systems.

## Installation

```
 yarn add chiffer
```

## Importing

### ESM

```ts
import { encode, decode, patterns } from 'chiffer'
const config = { pattern: patterns.binary }
encode(21, config) // => '10101'
decode('10101', config) // => 21
```

You might prefer importing using the namespace import if you don't want to
polute the module scope with these generic names.

```ts
import * as chiffer from 'chiffer'
const config = { pattern: chiffer.patterns.binary }
chiffer.encode(21, config) // => '10101'
chiffer.decode('10101', config) // => 21
```

### CJS

```ts
const chiffer = require('chiffer')
```

## Explanation

Chiffer defines numeral system as array of arrays of strings.

Each string represents a **symbol** for the digit in the target numeral system.
The common symbols for the binary system are strings `'0'` and `'1'`, but the system works just as well if we agree that the first digit is `'♦'` and the second one is `'♢'`. So both `'10101'` and `'♢♦♢♦♢'` are valid binary representations of the number `21` (written in our common decimal system with the usual convention for the meaning of digits).

Strings don't necessarily need to have **length of one character**. It's perfectly valid to pick `'apple'` and `'orange'` for the two digits of binary, and establish convention that digits are separated with a `#`. Then, the number `21` could be written as `'orange/apple/orange/apple/orange'`.

These strings which represent symbols are grouped in arrays. Their position in the array determines the **value** of the symbol. One of the conventions established earlier in the text was that `'♦'` and `'♢'` are, respectively, the first and the second digit of the binary system. This order is important; without the order we wouldn't know what is `'♢♦♢♦♢'` and what is `'♦♢♦♢♦'` (21 or 10). By giving an order to these symbols `['♦', '♢']`, we establish their respective values.

This explains the inner arrays, but not the outer array, the home to several arrays of symbols. The hint to why there's an additional array wrapping the currently discussed configuration is the name of the config property itself: `pattern`. Think back on how we count in decimal: we start from the digit of the lowest value (symbol `'0'`) and move along the symbols, until we get a dead end at the highest value (symbol `'9'`). Then, we let the digit wrap back to `0` (i.e. it overflows), and denote that we had one overflow by increasing the digit on the left. When there's nothing on the left, it's the same as having a `0` there; this is intuitive and common: `0001`, `001` and `01` are all understood as `1`). The process goes on: when we reach `19`, we wrap around the rightmost (“first”) digit, and bump the one of the left to `2`, giving us `20`. After `99`, two bums happen in a row, leaving us with `100`.

The key is to notice how we moved from `0` to `9` _for each position_ in the number. Everything we call a “numeral system” in everyday conversations are systems with a **fixed base**. The base is the number of digits available for every position: in decimal, that's 10; and in binary, that's 2. (Fun fact: written in the target numeral system, every system's base is 10!)

This seems so obvious, that it's difficult to imagine why a system with a **variable base** would even exist in practice. In fact, we use these kinds of systems in everyday life: we tell both time and date using it.

In a 24-hour clock, we encode number of seconds with a variable base: for seconds and minutes we use 60, but for hours we use 24. So after `00:00:59`, we go to `00:01:00`, and after `00:59:59` we go to `01:00:00`. After `23:59:59`, we'd overflow into a new day. Depending on how we formally define the numeral system, we could either write `1:00:00:00` (one day, zero hours, zero minutes, zero seconds), or just overflow back to `00:00:00`. We could even throw an exception, as if we're outside the defined scope. So, we have the following variable base:

- position 0 (leftmost), “seconds”, 60 symbols: `00`, `01`, ..., `59`;
- position 1 (middle), “minutes”, 60 symbols: `00`, `01`, ..., `59`;
- position 2 (rightmost), “hours”, : `00`, `01`, ..., `23`.

With a 12-hour clock, it's even more fun since there's an additional fourth position in base 2 (binary) using symbols `'AM'` and `'PM'` for the values. Thinking like this, the previous example with apples and oranges doesn't seem so weird after all. Furthermore, the symbols we use for hours are somewhat ridiculous, as they start at `12`, followed by `1` which increases to `11`. In other words:

- position 0 “seconds”, `00`, `01`, ..., `59`;
- position 1 “minutes”, `00`, `01`, ..., `59`;
- position 2 “hours”, `12`, `01`, `02`, `03` ..., `11`;
- position 3 “part of day”, `AM`, `PM`.

## API

### `encode`

Encodes a number into a different numeral system. Takes two parameters, `number` and `config`:

- `number` is the number that will be encoded;
- `config` describes the numeral system and provides additional guidelines about formatting the result.

#### `config.pattern: string[][]`

Describes the numeral system. See the explanation above.

#### `config.padding: number`

The minimal length of the encoded string, measured in number of symbols (not necessarily characters). The string will be padded with respective digits of the lowest values (“zeroes”, whatever they are).

By default, there's no padding (same as using `0`).

#### `config.resultAsArray: boolean`

If on, the result will be given as an array of symbols instead of a string. Useful when your digits are longer than one character and/or you want to use your own separator for displaying the string. Off by default.

#### Examples

##### Example 1 :: Binary system

A system with a fixed base 2.

```ts
const config = { pattern: [ ['0', '1'] ] }
encode(21, config) // => '10101'
```

##### Example 2 :: Hexadecimal system

A system with a fixed base 16.

```ts
const config = { pattern: [ ['0', '1', '2', '3', '4', '5', '6', '7',
                             '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'] ] } 
encode(21, config) // => '15'
```


##### Example 3 :: A 24-hour clock

A variable-based system described by a tuple (60, 60, 24).

```ts
const config = { 
  pattern: [ 
    ['00', '01', '02', '03', /* ... */ '56', '57', '58', '59'],
    ['00', '01', '02', '03', /* ... */ '56', '57', '58', '59'],
    ['00', '01', '02', /* ... */ '22', '23'],
  ],
  padding: 3,
  resultAsArray: true,
}
encode(21, config).join(':') // => '00:00:21'
encode(2103, config).join(':') // => '00:35:03'
encode(10_000, config).join(':') // => '02:46:40'
encode(50_000, config).join(':') // => '13:53:20'
```

##### Example 4 :: A 12-hour clock

A variable-based system described by a tuple (60, 60, 12, 2).

```ts
const config = { 
  pattern: [ 
    ['00', '01', '02', '03', /* ... */ '56', '57', '58', '59'],
    ['00', '01', '02', '03', /* ... */ '56', '57', '58', '59'],
    ['12', '01', '02', /* ... */ '10', '11'],
    ['AM', 'PM'],
  ],
  padding: 4,
  resultAsArray: true,
}
encode(21, config).join(':') // => 'AM:12:00:21'
encode(2103, config).join(':') // => 'AM:12:35:03'
encode(10_000, config).join(':') // => 'AM:02:46:40'
encode(50_000, config).join(':') // => 'PM:01:53:20'
```

##### Example 5 :: Random sentence generator

A system with a fixed base 4, but different symbols for each position.

```ts
const config = { 
  pattern: [ 
    ['books', 'trees', 'bananas', 'oranges'],
    ['read', 'see', 'eat', 'throw'],
    ['I', 'You', 'We', 'They'],
  ],
  padding: 3,
  resultAsArray: true,
}

const sentences: string[] = []
for (let i = 0; i < 4 ** 3; i++) {
  const sentence = encode(i, config).join(' ')
  sentences.push(sentence)
}

// => [
//   'I read books',
//   'I read trees',
//   'I read bananas',
//   'I read oranges',
//   'I see books',
//   'I see trees',
//   'I see bananas',
//   'I see oranges',
//   'I eat books',
//   'I eat trees',
//   'I eat bananas',
//   'I eat oranges',
//   'I throw books',
//   'I throw trees',
//   'I throw bananas',
//   'I throw oranges',
//   'I read books',
//   'I read trees',
//   'I read bananas',
//   'I read oranges',
//   'I see books',
//   'I see trees',
//   'I see bananas',
//   'I see oranges',
//   'I eat books',
//   'I eat trees',
//   'I eat bananas',
//   'I eat oranges',
//   'I throw books',
//   'I throw trees',
//   'I throw bananas',
//   'I throw oranges',
//   'You read books',
//   /* ... */
// ]
```

### `decode`

Inverse of `encode`. Takes two parameters, `number` and `config`:
                     
- `number` is a string or array of strings that will be decoded;
- `config` describes the numeral system.

#### `config.pattern: string[][]`

Describes the numeral system. See the explanation above.

There are no additional configuration tweaks for decoding. The function expects a correctly encoded strings which fits the provided pattern. Otherwise, the returned value will be a gibberish number (or the function will throw).

## Development

- Written in TypeScript.
- `yarn test` runs the tests.
- `yarn build` creates both ESM and CJS builds, along with declaration files.
