import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import JsonComparator from '../src/JsonComparator'

chai.use(chaiAsPromised)

describe('JsonComparator', () => {
  let comparator

  beforeEach(() => {
    comparator = new JsonComparator()
  })

  it('creates an instance of JsonComparator class', (done) => {
    expect(comparator.constructor.name).to.be.eql('JsonComparator')
    done()
  })

  it('Accepts two argument strings as data sources', async () => {
    await comparator.compare([[[]], [[]]])
    await comparator.compare([[['123']], [['456']]])
    await comparator.compare([[['!@#']], [['']]])
  })
  describe('Comparision between simple strings with zero or one difference', () => {
    const createExpected = (rowIndex, columnIndex, difference) => ([
      {
        rowIndex,
        columnIndex,
        difference,
      },
    ])

    it('returns no difference between empty strings', async () => {
      return expect(await comparator.compare([[['']], [['']]])).to.be.eql([])
    })
    it('returns proper difference between csv strings with one row and one cell', async () => {
      const localAssert = async (compareArgs, expected) =>
        expect(await comparator.compare(compareArgs)).to.be.eql(createExpected(0, 0, expected))

      return Promise.all([
        await localAssert([[['b']], [['a']]], ['b', 'a']),
        await localAssert([[['a']], [['b']]], ['a', 'b']),
      ])
    })
    it('returns proper difference between csv string with two rows and string with one row', async () => {
      return expect(await comparator.compare([[['a'], ['b']], [['a']]])).to.be.eql(createExpected(1, 0, ['b', '']))
    })
    it('returns proper difference between csv string with two columns and string with one column', async () => {
      const dataSource1 = [['b', 'a']]
      const dataSource2 = [['b']]
      return expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql(createExpected(0, 1, ['a', '']))
    })
  })
  describe('Comparision between simple strings with two or more differences', () => {
    it('returns two differences when comparing strings with two different columns', async () => {
      return expect(await comparator.compare([[['a', 'a']], [['b', 'b']]])).to.be.eql([
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
    })
    it('returns two differences when comparing strings with two different rows', async () => {
      return expect(await comparator.compare([[['a', 'a'], ['a', 'a']], [['b', 'b'], ['b', 'b']]])).to.be.eql([
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
    })
  })
  it('returns difference if only one element exists', async () => {
    return expect(await comparator.compare([[['a']], [[]]])).to.be.eql([
      {
        rowIndex: 0,
        columnIndex: 0,
        difference: ['a', ''],
      },
    ])
  })
  it('Assigns configuration options', (done) => {
    comparator = new JsonComparator({
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
    it('Returns empty array if allowExtraRows is true and only difference exists on extra rows', async () => {
      comparator = new JsonComparator({
        allowExtraRows: true,
      })
      const dataSource1 = [['1']] // 1 row
      const dataSource2 = [['1'], ['2'], ['3']] // 3 rows
      return expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([])
    })
    it('Returns empty array if allowExtraColumns is true and only difference exists on extra columns', async () => {
      comparator = new JsonComparator({
        allowExtraColumns: true,
      })
      const dataSource1 = [['1']] // 1 column
      const dataSource2 = [['1', '2', '3']] // 3 rows
      return expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([])
    })
    it('Returns array with difference when difference exists on extra columns', async () => {
      comparator = new JsonComparator({
        allowExtraColumns: false,
      })
      const dataSource1 = [['1']] // 1 column
      const dataSource2 = [['1', '2']] // 3 rows
      return expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([
        {
          columnIndex: 1,
          rowIndex: 0,
          difference: [
            '',
            '2',
          ],
        },
      ])
    })
    it('Returns empty array when allowEmptyCells option is true', async () => {
      comparator = new JsonComparator({
        allowEmptyCells: true,
      })
      const dataSource1 = [['1', '', '3']]
      const dataSource2 = [['1', '2', '3']]
      return expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([])
    })
    it('Returns empty array when allowEmptyCells option is true and sources are empty strings', async () => {
      comparator = new JsonComparator({
        allowEmptyCells: true,
      })
      const dataSource1 = [['', '', '']]
      const dataSource2 = [['', '', '']]
      return expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([])
    })
    describe('Custom cells equality function - cellsEqualityFn', () => {
      it('Returns empty array if cellsEqualityFn always returns true', async () => {
        comparator = new JsonComparator({
          cellsEqualityFn: () => true,
        })
        const dataSource1 = [['1', '2', '3']]
        const dataSource2 = [['4', '5', '6']]
        expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([])
      })
      it('Returns every cell as difference if cellsEqualityFn always returns false', async () => {
        comparator = new JsonComparator({
          cellsEqualityFn: () => false,
        })
        const dataSource1 = [['1']]
        const dataSource2 = [['1']]
        expect(await comparator.compare([dataSource1, dataSource2])).to.be.eql([{
          columnIndex: 0,
          rowIndex: 0,
          difference: ['1', '1'],
        }])
      })
    })
  })
})
