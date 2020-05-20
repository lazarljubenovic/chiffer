import { describe, it } from 'mocha'
import * as chai from 'chai'
import * as chiffer from './index'

describe(`Encoding`, () => {

  describe(`Binary`, () => {

    const config: chiffer.EncodeConfig = { pattern: chiffer.patterns.binary }

    it(`works for an arbitrary number`, () => {
      const actual = chiffer.encode(21, config)
      const expected = `10101`
      chai.assert.equal(actual, expected)
    })

    it(`works for 1`, () => {
      const actual = chiffer.encode(1, config)
      const expected = `1`
      chai.assert.equal(actual, expected)
    })

    it(`works for 0`, () => {
      const actual = chiffer.encode(0, config)
      const expected = `0`
      chai.assert.equal(actual, expected)
    })

  })

  describe(`Hexadecimal`, () => {

    const config: chiffer.EncodeConfig = { pattern: chiffer.patterns.hexadecimal }

    it(`works for an arbitrary number`, () => {
      const actual = chiffer.encode(21, config)
      const expected = `15`
      chai.assert.equal(actual, expected)
    })

    it(`works for 1`, () => {
      const actual = chiffer.encode(1, config)
      const expected = `1`
      chai.assert.equal(actual, expected)
    })

    it(`works for 0`, () => {
      const actual = chiffer.encode(0, config)
      const expected = `0`
      chai.assert.equal(actual, expected)
    })

  })

  describe(`24-hour clock`, () => {

    const toFiftyNine = Array.from({length: 60}).map((_, i) => i.toString(10).padStart(2, '0'))
    const toTwentyThree = Array.from({length: 24}).map((_, i) => i.toString(10).padStart(2, '0'))

    const config = {
      pattern: [toFiftyNine, toFiftyNine, toTwentyThree],
      padding: 3,
      resultAsArray: true as const,
    }

    it(`works for 0`, () => {
      const actual = chiffer.encode(0, config).join(':')
      const expected = `00:00:00`
      chai.assert.equal(actual, expected)
    })

    it(`works for 21`, () => {
      const actual = chiffer.encode(21, config).join(':')
      const expected = `00:00:21`
      chai.assert.equal(actual, expected)
    })

    it(`works for 2103`, () => {
      const actual = chiffer.encode(2103, config).join(':')
      const expected = '00:35:03'
      chai.assert.equal(actual, expected)
    })

    it(`works for 10_000`, () => {
      const actual = chiffer.encode(10_000, config).join(':')
      const expected = '02:46:40'
      chai.assert.equal(actual, expected)
    })

    it(`works for 50_000`, () => {
      const actual = chiffer.encode(50_000, config).join(':')
      const expected = '13:53:20'
      chai.assert.equal(actual, expected)
    })

  })

  describe(`12-hour clock`, () => {

    const toFiftyNine = Array.from({length: 60}).map((_, i) => i.toString(10).padStart(2, '0'))
    const hours = Array.from({length: 12}).map((_, i) => i.toString(10).padStart(2, '0')).slice(1)
    hours.unshift('12')
    const partOfDay = ['AM', 'PM']

    const config = {
      pattern: [toFiftyNine, toFiftyNine, hours, partOfDay],
      padding: 4,
      resultAsArray: true as const,
    }

    it(`works for 0`, () => {
      const actual = chiffer.encode(0, config).join(':')
      const expected = `AM:12:00:00`
      chai.assert.equal(actual, expected)
    })

    it(`works for 2103`, () => {
      const actual = chiffer.encode(2103, config).join(':')
      const expected = 'AM:12:35:03'
      chai.assert.equal(actual, expected)
    })

    it(`works for 10_000`, () => {
      const actual = chiffer.encode(10_000, config).join(':')
      const expected = 'AM:02:46:40'
      chai.assert.equal(actual, expected)
    })

    it(`works for 50_000`, () => {
      const actual = chiffer.encode(50_000, config).join(':')
      const expected = 'PM:01:53:20'
      chai.assert.equal(actual, expected)
    })

  })

  describe(`Simplified calendar`, () => {

    const config = {
      pattern: [
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
      ],
      padding: 3,
      resultAsArray: true as const,
    }

    it(`works for an arbitrary number`, () => {
      const actual = chiffer.encode(80, config).join('-')
      const expected = `2020-Mar-21`
      chai.assert.equal(actual, expected)
    })

  })


})
