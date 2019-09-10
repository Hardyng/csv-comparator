import ComparisionResult from './ComparisionResult'
import DataSourceHashMap from './DataSourceHashMap'
import ComparisionRowStatus from './helpers/ComparisionRowStatus'
import fill from 'lodash/fill'

export default function compareSources (source1, source2, options = {
  indexColumns: null,
  trackColumns: null,
  firstRowIsHeader: false,
}) {
  const tableResult = []
  // Find how many columns there are
  const maxCols1 = Math.max(...source1.map(arr => arr.length))
  const maxCols2 = Math.max(...source2.map(arr => arr.length))
  const maxCols = Math.max(maxCols1, maxCols2)
  // Fill array with empty values to adjust to added columns
  source1 = source1.map(arr => [...arr, ...fill(Array(maxCols - arr.length), '')])
  source2 = source2.map(arr => [...arr, ...fill(Array(maxCols - arr.length), '')])

  const hashMap = new DataSourceHashMap(source1.slice(options.firstRowIsHeader ? 1 : 0), options)
  const comparisionHashMap = new DataSourceHashMap(source2.slice(options.firstRowIsHeader ? 1 : 0), options)
  // insert edited
  hashMap.asArray.forEach(({index, value}) => {
    const comparisionRow = comparisionHashMap.getRow(index)
    // handle removed
    if (comparisionRow) {
      const comparision = DataSourceHashMap.compare(value, comparisionRow)
      tableResult.push(comparision)
    } else {
      tableResult.push({
        status: ComparisionRowStatus.REMOVED,
        values: value.map(cell => ({
          value: cell,
          changed: true,
          newValue: null,
        })),
      })
    }
  })

  // handle added
  const addedRows = comparisionHashMap.asArray.filter(({index}) => !hashMap.getRow(index))
  addedRows.forEach(({positionIndex, index, value}) => {
    const status = {
      status: ComparisionRowStatus.ADDED,
      values: value.map(cell => ({
        value: cell,
        changed: true,
        oldValue: cell,
      })),
    }
    tableResult.splice(positionIndex + 1, 0, status)
  })

  return new ComparisionResult(tableResult, source1, source2, options)
}
