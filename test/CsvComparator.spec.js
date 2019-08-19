import {expect} from 'chai'
import CsvComparator from '../src/CsvComparator'

describe('CsvComparator', () => {
  let comparator


  beforeEach(() => {
    comparator = new CsvComparator()
  })

  it('creates an instance of CsvComparator class', (done) => {
    expect(comparator.constructor.name).to.be.eql('CsvComparator')
    done()
  })

  it('Accepts two argument strings as data sources', async () => {
    await comparator.compare('', '')
    await comparator.compare('123', '456')
    await comparator.compare('!@#', '')
  })
  describe('Properly compares simple strings with one difference when it', () => {
    const createExpected = (rowIndex, cellIndex, difference) => ({
      differentRows: [
        {
          rowIndex,
          cellIndex,
          difference,
        },
      ],
      success: true,
    })

    it('has empty strings', async () => {
      const result = await comparator.compare('', '')
      const expected = {
        differentRows: [],
        success: true,
      }
      return expect(result).to.be.eql(expected)
    })
    it('has one cell csv strings', async () => {
      const localAssert = async (compareArgs) =>
        expect(await comparator.compare(...compareArgs)).to.be.eql(createExpected(0, 0, compareArgs))

      return Promise.all([
        await localAssert(['b', 'a']),
        await localAssert(['a', 'b']),
      ])
    })
    it('has different number of rows', async () => {
      return expect(await comparator.compare('b\na', 'b')).to.be.eql(createExpected(1, 0, ['a', '']))
    })
    it('has different number of columns', async () => {
      return expect(await comparator.compare('b,a', 'b')).to.be.eql(createExpected(0, 1, ['a', '']))
    })
  })
  describe('Properly compares strings with more than one difference', () => {
    it('has two different cells', async () => {
      return expect(await comparator.compare('a,a', 'b,b')).to.be.eql({
        differentRows: [
          {
            rowIndex: 0,
            cellIndex: 0,
            difference: ['a', 'b'],
          },
          {
            rowIndex: 0,
            cellIndex: 1,
            difference: ['a', 'b'],
          },
        ],
        success: true,
      })
    })
    it('has two different rows', async () => {
      return expect(await comparator.compare('a,a\na,a', 'b,b\nb,b')).to.be.eql({
        differentRows: [
          {
            rowIndex: 0,
            cellIndex: 0,
            difference: ['a', 'b'],
          },
          {
            rowIndex: 0,
            cellIndex: 1,
            difference: ['a', 'b'],
          },
          {
            rowIndex: 1,
            cellIndex: 0,
            difference: ['a', 'b'],
          },
          {
            rowIndex: 1,
            cellIndex: 1,
            difference: ['a', 'b'],
          },
        ],
        success: true,
      })
    })
  })
})
