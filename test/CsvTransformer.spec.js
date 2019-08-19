import {expect} from 'chai'
import CsvTransformer from '../src/CsvTransformer'
import fs from 'fs'
import path from 'path'

describe('CsvTransformer', () => {
  it('is instance of CsvTransformer class', (done) => {
    expect(CsvTransformer.constructor.name).to.be.eql('CsvTransformer')
    done()
  })
  describe('transformSingle()', () => {
    it('transforms csv string into arrays', async () => {
      return Promise.all([
        expect(await CsvTransformer.transformSingle('a, a')).to.be.eql([['a', 'a']]),
        expect(await CsvTransformer.transformSingle('a, b, c, d')).to.be.eql([['a', 'b', 'c', 'd']]),
        expect(await CsvTransformer.transformSingle('a, b, c, d\ne, f, g, h')).to.be.eql([['a', 'b', 'c', 'd'], ['e', 'f', 'g', 'h']]),
        expect(await CsvTransformer.transformSingle('a\nb, c, d, e')).to.be.eql([['a'], ['b', 'c', 'd', 'e']]),
        expect(await CsvTransformer.transformSingle('a, b, c\nd')).to.be.eql([['a', 'b', 'c'], ['d']]),
      ])
    })
    it('transforms buffers into arrays', async () => {
      const emptyFile = fs.readFileSync(path.join(__dirname, './mocks/empty.csv'))
      const singleLetterFile = fs.readFileSync(path.join(__dirname, './mocks/singleLetter.csv'))
      const manyRowsFile = fs.readFileSync(path.join(__dirname, './mocks/manyRows.csv'))
      return Promise.all([
        expect(await CsvTransformer.transformSingle(emptyFile)).to.be.eql([]),
        expect(await CsvTransformer.transformSingle(singleLetterFile)).to.be.eql([['a']]),
        expect(await CsvTransformer.transformSingle(manyRowsFile)).to.be.eql([['a', 'b', 'c'], ['d', 'e', 'f']]),
      ])
    })
  })
})
