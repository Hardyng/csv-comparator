import compareResult from './ComparisionResult'
import DataSourceHashMap from './DataSourceHashMap'

export default function compareSources (source1, source2, options = {
  indexColumns: null,
}) {
  const tableResult = []
  const hashMap = new DataSourceHashMap(source1, options)
  const comparisionHashMap = new DataSourceHashMap(source2, options)
  // insert edited

  hashMap.asArray.forEach(({positionIndex, index, value}) => {
    const comparisionRow = comparisionHashMap.getRow(index)
    // handle removed
    if (comparisionRow) {
      const comparision = DataSourceHashMap.compare(value, comparisionRow)
      tableResult.push(comparision)
    } else {
      tableResult.push({
        status: 'REMOVED',
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
      status: 'ADDED',
      values: value.map(cell => ({
        value: null,
        changed: true,
        newValue: cell,
      })),
    }
    tableResult.splice(positionIndex + 1, 0, status)
  })

  return compareResult(tableResult)
}
