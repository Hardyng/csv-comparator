import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import compareSources from '../src/compareSources'
import * as compareResultModule from '../src/ComparisionResult'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('compareSources', () => {
  beforeEach(() => {
    sinon.restore()
  })
  describe('working without index columns', () => {
    it('compares two empty arrays', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([[]], [[]])
      expect(fake).to.have.been.calledWith([])
      done()
    })
    it('compares two arrays with single string "A"', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A']], [['A']])
      expect(fake).to.have.been.calledWith([{
        status: 'IDLE',
        values: [
          {
            value: 'A',
            changed: false,
            newValue: 'A',
          },
        ],
      }])
      done()
    })
    it('compares array with single string "A" and array with single string "B"', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A']], [['B']])
      expect(fake).to.have.been.calledWith([{
        status: 'CHANGED',
        values: [
          {
            value: 'A',
            changed: true,
            newValue: 'B',
          },
        ],
      }])
      done()
    })
    it('compares multiple rows', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A'], ['B'], ['C']], [['A'], ['B'], ['C']])
      expect(fake).to.have.been.calledWith([
        {
          status: 'IDLE',
          values: [
            {
              value: 'A',
              changed: false,
              newValue: 'A',
            },
          ],
        },
        {
          status: 'IDLE',
          values: [
            {
              value: 'B',
              changed: false,
              newValue: 'B',
            },
          ],
        },
        {
          status: 'IDLE',
          values: [
            {
              value: 'C',
              changed: false,
              newValue: 'C',
            },
          ],
        },
      ])
      done()
    })
    it('compares array with single string "A" and empty array', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A']], [])
      expect(fake).to.have.been.calledWith([{
        status: 'REMOVED',
        values: [
          {
            value: 'A',
            changed: true,
            newValue: null,
          },
        ],
      }])
      done()
    })
    it('compares empty and array with single string "A"', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([], [['A']])
      expect(fake).to.have.been.calledWith([{
        status: 'ADDED',
        values: [
          {
            value: 'A',
            changed: true,
            oldValue: 'A',
          },
        ],
      }])
      done()
    })
    it('successfully detects changes and new rows', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A'], ['B'], ['C']], [['A'], ['D'], ['C'], ['E']])
      expect(fake).to.have.been.calledWith([
        {
          status: 'IDLE',
          values: [
            {
              value: 'A',
              changed: false,
              newValue: 'A',
            },
          ],
        },
        {
          status: 'CHANGED',
          values: [
            {
              value: 'B',
              changed: true,
              newValue: 'D',
            },
          ],
        },
        {
          status: 'IDLE',
          values: [
            {
              value: 'C',
              changed: false,
              newValue: 'C',
            },
          ],
        },
        {
          status: 'ADDED',
          values: [
            {
              value: 'E',
              changed: true,
              oldValue: 'E',
            },
          ],
        },
      ])
      done()
    })
    it('successfully detects removed rows', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A'], ['B']], [['A']])
      expect(fake).to.have.been.calledWith([
        {
          status: 'IDLE',
          values: [
            {
              value: 'A',
              changed: false,
              newValue: 'A',
            },
          ],
        },
        {
          status: 'REMOVED',
          values: [
            {
              value: 'B',
              changed: true,
              newValue: null,
            },
          ],
        },
      ])
      done()
    })
  })
  describe('working with index columns', () => {
    it('compares two arrays with string "A"', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A']], [['A']], {
        indexColumns: [0],
      })
      expect(fake).to.have.been.calledWith([{
        status: 'IDLE',
        values: [{
          changed: false,
          value: 'A',
          newValue: 'A',
        }],
      }])
      done()
    })
    it('compares two data sources with shuffled order but exact content and returns IDLE statuses', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A', 'B'], ['B', 'A']], [['B', 'A'], ['A', 'B']], {
        indexColumns: [0],
      })
      expect(fake).to.have.been.calledWith([
        {
          status: 'IDLE',
          values: [
            {
              changed: false,
              value: 'A',
              newValue: 'A',
            },
            {
              changed: false,
              value: 'B',
              newValue: 'B',
            },
          ],
        },
        {
          status: 'IDLE',
          values: [
            {
              changed: false,
              value: 'B',
              newValue: 'B',
            },
            {
              changed: false,
              value: 'A',
              newValue: 'A',
            },
          ],
        },
      ])
      done()
    })
    it('performs advanced comparision with IDLE, REMOVED and ADDED statuses', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A'], ['B'], ['C']], [['A'], ['C'], ['D']], {
        indexColumns: [0],
      })
      expect(fake).to.have.been.calledWith([
        {
          status: 'IDLE',
          values: [
            {
              changed: false,
              value: 'A',
              newValue: 'A',
            },
          ],
        },
        {
          status: 'REMOVED',
          values: [
            {
              changed: true,
              value: 'B',
              newValue: null,
            },
          ],
        },
        {
          status: 'IDLE',
          values: [
            {
              changed: false,
              value: 'C',
              newValue: 'C',
            },
          ],
        },
        {
          status: 'ADDED',
          values: [
            {
              changed: true,
              value: 'D',
              oldValue: 'D',
            },
          ],
        },
      ])
      done()
    })
    it('detects when row was changed and return one CHANGED status', (done) => {
      const fake = sinon.fake()
      sinon.replace(compareResultModule, 'default', fake)
      compareSources([['A', 'payload-A'], ['B', 'payload-B']], [['B', 'payload-B-new'], ['A', 'payload-A']], {
        indexColumns: [0],
      })
      expect(fake).to.have.been.calledWith([
        {
          status: 'IDLE',
          values: [
            {
              changed: false,
              value: 'A',
              newValue: 'A',
            },
            {
              changed: false,
              value: 'payload-A',
              newValue: 'payload-A',
            },
          ],
        },
        {
          status: 'CHANGED',
          values: [
            {
              changed: false,
              value: 'B',
              newValue: 'B',
            },
            {
              changed: true,
              value: 'payload-B',
              newValue: 'payload-B-new',
            },
          ],
        },
      ])
      done()
    })
  })
})
