import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import JsonComparator from '../src/JsonComparator'

chai.use(chaiAsPromised)

describe('JsonComparator', () => {
  it('creates an instance of JsonComparator class', (done) => {
    const comparator = new JsonComparator()
    expect(comparator.constructor.name).to.be.eql('JsonComparator')
    done()
  })

  it('Accepts two argument strings as data sources', (done) => {
    new JsonComparator([[[]], [[]]]).compare().asList.difference
    new JsonComparator([[['123']], [['456']]]).compare().asList.difference
    new JsonComparator([[['!@#']], [['']]]).compare().asList.difference
    done()
  })
  describe('Comparision between simple strings with zero or one difference', () => {
    const createExpected = (rowIndex, columnIndex, difference) => ([
      {
        rowIndex,
        columnIndex,
        difference,
      },
    ])

    it('returns no difference between empty strings', (done) => {
      expect(new JsonComparator([[['']], [['']]]).compare().asList.difference).to.be.eql([])
      done()
    })
    it('returns proper difference between csv strings with one row and one cell', (done) => {
      const localAssert = (compareArgs, expected) =>
        expect(new JsonComparator(compareArgs).compare().asList.difference).to.be.eql(createExpected(0, 0, expected))

      localAssert([[['b']], [['a']]], ['b', 'a'])
      localAssert([[['a']], [['b']]], ['a', 'b'])
      done()
    })
    it('returns proper difference between csv string with two rows and string with one row', (done) => {
      expect(new JsonComparator([[['a'], ['b']], [['a']]]).compare().asList.difference).to.be.eql(createExpected(1, 0, ['b', null]))
      done()
    })
    it('returns proper difference between csv string with two columns and string with one column', (done) => {
      const dataSource1 = [['b', 'a']]
      const dataSource2 = [['b']]
      expect(new JsonComparator([dataSource1, dataSource2]).compare().asList.difference).to.be.eql(createExpected(0, 1, ['a', null]))
      done()
    })
  })
  describe('Comparision between simple strings with two or more differences', () => {
    it('returns two differences when comparing strings with two different columns', (done) => {
      expect(new JsonComparator([[['a', 'a']], [['b', 'b']]]).compare().asList.difference).to.be.eql([
        {
          rowIndex: 0,
          columnIndex: 0,
          difference: ['a', 'b'],
        },
        {
          rowIndex: 0,
          columnIndex: 1,
          difference: ['a', 'b'],
        },
      ])
      done()
    })
    it('returns two differences when comparing strings with two different rows', (done) => {
      expect(new JsonComparator([[['a', 'a'], ['a', 'a']], [['b', 'b'], ['b', 'b']]]).compare().asList.difference).to.be.eql([
        {
          rowIndex: 0,
          columnIndex: 0,
          difference: ['a', 'b'],
        },
        {
          rowIndex: 0,
          columnIndex: 1,
          difference: ['a', 'b'],
        },
        {
          rowIndex: 1,
          columnIndex: 0,
          difference: ['a', 'b'],
        },
        {
          rowIndex: 1,
          columnIndex: 1,
          difference: ['a', 'b'],
        },
      ])
      done()
    })
  })
  it('returns difference if only one element exists', (done) => {
    expect(new JsonComparator([[['a']], [[]]]).compare().asList.difference).to.be.eql([
      {
        rowIndex: 0,
        columnIndex: 0,
        difference: ['a', null],
      },
    ])
    done()
  })
  it('Assigns configuration options', (done) => {
    const comparator = new JsonComparator(null, {
      allowExtraRows: true,
      allowExtraColumns: true,
      allowEmptyCells: true,
    })
    expect(comparator.allowExtraRows).to.be.eql(true)
    expect(comparator.allowExtraColumns).to.be.eql(true)
    expect(comparator.allowEmptyCells).to.be.eql(true)
    done()
  })
  describe('Compares entities based on configuration options', () => {
    it('Returns empty array if allowExtraRows is true and only difference exists on extra rows', (done) => {
      const dataSource1 = [['1']] // 1 row
      const dataSource2 = [['1'], ['2'], ['3']] // 3 rows

      const comparator = new JsonComparator([dataSource1, dataSource2], {
        allowExtraRows: true,
      })
      expect(comparator.compare().asList.difference).to.be.eql([])
      done()
    })
    it('Returns empty array if allowExtraColumns is true and only difference exists on extra columns', (done) => {
      const dataSource1 = [['1']] // 1 column
      const dataSource2 = [['1', '2', '3']] // 3 rows

      const comparator = new JsonComparator([dataSource1, dataSource2], {
        allowExtraColumns: true,
      })
      expect(comparator.compare().asList.difference).to.be.eql([])
      done()
    })
    it('Returns array with difference when difference exists on extra columns', (done) => {
      const dataSource1 = [['1']] // 1 column
      const dataSource2 = [['1', '2']] // 3 rows

      const comparator = new JsonComparator([dataSource1, dataSource2], {
        allowExtraColumns: false,
      })
      expect(comparator.compare().asList.difference).to.be.eql([
        {
          columnIndex: 1,
          rowIndex: 0,
          difference: [
            null,
            '2',
          ],
        },
      ])
      done()
    })
    it('Returns empty array when allowEmptyCells option is true', (done) => {
      const dataSource1 = [['1', null, '3']]
      const dataSource2 = [['1', '2', '3']]
      const comparator = new JsonComparator([dataSource1, dataSource2], {
        allowEmptyCells: true,
      })
      expect(comparator.compare().asList.difference).to.be.eql([])
      done()
    })
    it('Returns empty array when allowEmptyCells option is true and sources are empty strings', (done) => {
      const dataSource1 = [['', '', '']]
      const dataSource2 = [['', '', '']]
      const comparator = new JsonComparator([dataSource1, dataSource2], {
        allowEmptyCells: true,
      })

      expect(comparator.compare().asList.difference).to.be.eql([])
      done()
    })
    describe('Custom cells equality function - cellsEqualityFn', () => {
      it('Returns empty array if cellsEqualityFn always returns true', (done) => {
        const dataSource1 = [['1', '2', '3']]
        const dataSource2 = [['4', '5', '6']]
        const comparator = new JsonComparator([dataSource1, dataSource2], {
          cellsEqualityFn: () => true,
        })

        expect(comparator.compare().asList.difference).to.be.eql([])
        done()
      })
      it('Returns every cell as difference if cellsEqualityFn always returns false', (done) => {
        const dataSource1 = [['1']]
        const dataSource2 = [['1']]
        const comparator = new JsonComparator([dataSource1, dataSource2], {
          cellsEqualityFn: () => false,
        })

        expect(comparator.compare().asList.difference).to.be.eql([{
          columnIndex: 0,
          rowIndex: 0,
          difference: ['1', '1'],
        }])
        done()
      })
    })

    describe('get asTable()', () => {
      it('Returns formatted initial array if there is no difference', (done) => {
        expect(new JsonComparator([[[]], [[]]]).compare().asTable.table).to.be.eql([[]])
        expect(new JsonComparator([[[3]], [[3]]]).compare().asTable.table).to.be.eql([[{
          value: 3,
          isDifferent: false,
          difference: null,
        }]])
        done()
      })
      it('Returns formatted initial array with pointed out differences', (done) => {
        expect(new JsonComparator([[[2]], [[3]]]).compare().asTable.table).to.be.eql([[{
          value: 2,
          isDifferent: true,
          difference: [2, 3],
        }]])
        expect(new JsonComparator([[[2, 5]], [[3]]]).compare().asTable.table).to.be.eql([[
          {
            value: 2,
            isDifferent: true,
            difference: [2, 3],
          },
          {
            value: 5,
            isDifferent: true,
            difference: [5, null],
          },
        ]])
        done()
      })
      it('Returns difference on extra rows', (done) => {
        expect(new JsonComparator([[[1]], [[1], [2]]]).compare().asTable.table[1][0]).to.be.eql({
          value: null,
          isDifferent: true,
          difference: [null, 2],
        })
        done()
      })
    })
  })
})
