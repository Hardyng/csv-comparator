import {expect} from 'chai'
import CsvTransformer from '../src/CsvTransformer'
import fs from 'fs'
import path from 'path'

describe('CsvTransformer', () => {
  it('is instance of CsvTransformer class', (done) => {
    expect(new CsvTransformer().constructor.name).to.be.eql('CsvTransformer')
    done()
  })
  describe('transformSingle()', () => {
    it('transforms csv string into arrays', async () => {
      async function localAssert (dataSource, expected) {
        console.log(await new CsvTransformer().transformSingle(dataSource))
        return expect(await new CsvTransformer().transformSingle(dataSource)).to.be.eql(expected)
      }

      return Promise.all([
        localAssert('a,a', [['a', 'a']]),
        localAssert('a,b,c,d', [['a', 'b', 'c', 'd']]),
        localAssert('a,b,c,d\ne,f,g,h', [['a', 'b', 'c', 'd'], ['e', 'f', 'g', 'h']]),
        localAssert('a\nb,c,d,e', [['a'], ['b', 'c', 'd', 'e']]),
        localAssert('a,b,c\nd', [['a', 'b', 'c'], ['d']]),
      ])
    })
    it('parses different separators', async () => {
      async function localAssert (delimiter, dataSource, expectedResult) {
        return expect(await new CsvTransformer({delimiter}).transformSingle(dataSource)).to.be.eql(expectedResult)
      }

      return Promise.all([
        localAssert(';', 'a;a', [['a', 'a']]),
        localAssert('e', 'aea', [['a', 'a']]),
        localAssert('.', 'a.b.c.d', [['a', 'b', 'c', 'd']]),
      ])
    })
  })
})
