import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import ComparisionResult from '../src/ComparisionResult'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ComparisionRowStatus from '../src/helpers/ComparisionRowStatus'
chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('ComparisionResult', () => {
  beforeEach(() => {
    sinon.restore()
  })
  describe('getDifferenceList', () => {
    /**
     * @param {ComparisionRow[]} rows
     * @private
     */
    function _getList (rows) {
      return new ComparisionResult(rows).getDifferenceList()
    }

    it('maps empty array', (done) => {
      expect(_getList([])).to.be.eql([])
      done()
    })
    it('return empty array when all rows have status IDLE', (done) => {
      const rows = [
        {
          status: ComparisionRowStatus.IDLE,
          values: [
            {
              changed: false,
              value: 5,
              newValue: undefined,
            },
          ],
        },
      ]
      expect(_getList(rows)).to.be.eql([])
      done()
    })
    it('return one difference when one row has status CHANGED', (done) => {
      const rows = [
        {
          status: ComparisionRowStatus.CHANGED,
          values: [
            {
              changed: true,
              value: 1,
              newValue: 2,
            },
          ],
        },
      ]
      expect(_getList(rows)).to.be.eql([
        {
          difference: [1, 2],
          row: [1],
        },
      ])
      done()
    })
    it('return differences with different statuses', (done) => {
      const rows = [
        {
          status: ComparisionRowStatus.CHANGED,
          values: [
            {
              changed: true,
              value: 1,
              newValue: 2,
            },
          ],
        },
        {
          status: ComparisionRowStatus.IDLE,
          values: [
            {
              changed: false,
              value: 1,
            },
          ],
        },
        {
          status: ComparisionRowStatus.REMOVED,
          values: [
            {
              changed: true,
              value: 1,
              newValue: null,
            },
          ],
        },
        {
          status: ComparisionRowStatus.ADDED,
          values: [
            {
              changed: true,
              value: null,
              newValue: 1,
            },
          ],
        },
      ]
      expect(_getList(rows)).to.be.eql([
        {
          difference: [1, 2],
          row: [1],
        },
        {
          difference: [1, null],
          row: [1],
        },
        {
          difference: [null, 1],
          row: [null],
        },
      ])
      done()
    })
  })
  describe('getRemoved', () => {
    it('filters empty array', (done) => {
      const removed = new ComparisionResult([]).getRemoved()
      expect(removed.value).to.be.eql([])
      done()
    })
    it('filters all wrong statuses', (done) => {
      const rows = [
        {
          status: ComparisionRowStatus.IDLE,
        },
        {
          status: ComparisionRowStatus.CHANGED,
        },
        {
          status: ComparisionRowStatus.ADDED,
        },
        {
          status: ComparisionRowStatus.REMOVED,
        },
      ]

      const removed = new ComparisionResult(rows).getRemoved()
      expect(removed.value).to.be.eql([
        {
          status: ComparisionRowStatus.REMOVED,
        },
      ])
      done()
    })
  })
})
