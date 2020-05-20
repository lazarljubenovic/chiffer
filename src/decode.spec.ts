import { describe, it } from 'mocha'
import * as chai from 'chai'
import * as chiffer from './index'

describe(`Decoding`, () => {

  describe(`Binary`, () => {

    const config: chiffer.EncodeConfig = { pattern: chiffer.patterns.binary }

    it(`works for an arbitrary number`, () => {
      const actual = chiffer.decode(`10101`, config)
      const expected = 21
      chai.assert.equal(actual, expected)
    })

    it(`works for 1`, () => {
      const actual = chiffer.decode(`1`, config)
      const expected = 1
      chai.assert.equal(actual, expected)
    })

    it(`works for 0`, () => {
      const actual = chiffer.decode(`0`, config)
      const expected = 0
      chai.assert.equal(actual, expected)
    })

  })

  describe(`Hexadecimal`, () => {

    const config: chiffer.EncodeConfig = { pattern: chiffer.patterns.hexadecimal }

    it(`works for an arbitrary number`, () => {
      const actual = chiffer.decode(`15`, config)
      const expected = 21
      chai.assert.equal(actual, expected)
    })

    it(`works for 1`, () => {
      const actual = chiffer.decode(`1`, config)
      const expected = 1
      chai.assert.equal(actual, expected)
    })

    it(`works for 0`, () => {
      const actual = chiffer.decode(`0`, config)
      const expected = 0
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
    }

    it(`works for an arbitrary number`, () => {
      const actual = chiffer.decode(['2020', 'Mar', '21'], config)
      const expected = 80
      chai.assert.equal(actual, expected)
    })

  })


})
