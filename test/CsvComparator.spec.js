import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import CsvComparator from '../src/CsvComparator'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import JsonComparator from '../src/JsonComparator'

chai.use(sinonChai)
chai.use(chaiAsPromised)

describe('CsvComparator', () => {
  let comparator

  beforeEach(() => {
    sinon.restore()
    comparator = new CsvComparator()
  })

  it('creates an instance of CsvComparator class', (done) => {
    expect(comparator.constructor.name).to.be.eql('CsvComparator')
    done()
  })

  it('Accepts two argument strings as data sources', async () => {
    sinon.replace(comparator.csvTransformer, 'transform', sinon.fake())
    sinon.replace(JsonComparator.prototype, 'compare', sinon.fake.resolves())
    await comparator.compare('', '')
    await comparator.compare('123', '456')
    await comparator.compare('!@#', '')
  })
  it('calls csv transformer and jsonComparator and resolves based on their outputs', async () => {
    const csvTransformerFake = sinon.fake.resolves([['123'], ['1234']])
    const jsonComparatorFake = sinon.fake.resolves(['321'])
    sinon.replace(comparator.csvTransformer, 'transform', csvTransformerFake)
    sinon.replace(JsonComparator.prototype, 'compare', jsonComparatorFake)
    const result = await comparator.compare('1', '2')
    expect(csvTransformerFake).to.have.been.calledWith(['1', '2'])
    expect(jsonComparatorFake).to.have.been.calledWith([['123'], ['1234']])

    expect(result).to.be.eql(['321'])
  })
  describe('Initialization options', () => {
    it('accepts csvtojson options', (done) => {
      expect(new CsvComparator().options.csvToJsonOptions).to.be.eql({}) // default
      expect(new CsvComparator({csvToJsonOptions: {delimiter: ';'}}).options.csvToJsonOptions.delimiter).to.be.eql(';')
      done()
    })
    it('accepts differences options', (done) => {
      expect(new CsvComparator({allowExtraRows: true}).options.allowExtraRows).to.be.eql(true) // default
      expect(new CsvComparator({allowExtraColumns: true}).options.allowExtraColumns).to.be.eql(true) // default
      expect(new CsvComparator({allowEmptyCells: true}).options.allowEmptyCells).to.be.eql(true) // default
      const cellsEqualityFn = () => {}
      expect(new CsvComparator({cellsEqualityFn}).options.cellsEqualityFn).to.be.eql(cellsEqualityFn) // default
      done()
    })
  })
})
