import toPairs from 'lodash/toPairs'
import keyBy from 'lodash/keyBy'
import ComparisionRowStatus from './helpers/ComparisionRowStatus'

export default class DataSourceHashMap {
  constructor (values, options) {
    this._hashMap = this._createHashMap(values, {indexColumns: options.indexColumns})
    this._options = options
    this.getRow = this.getRow.bind(this)
    this.getIndex = this.getIndex.bind(this)
  }

  getRow (index) {
    return this._hashMap[index]
  }

  getIndex (row, rowIndex) {
    if (this._options.indexColumns && this._options.indexColumns.length) {
      return this._options.indexColumns.map(col => row[col]).join('-')
    } else {
      return rowIndex
    }
  }
  get asArray () {
    return toPairs(this._hashMap).map((pair, positionIndex) => ({
      positionIndex,
      index: pair[0],
      value: pair[1],
    }))
  }

  static compare (row1, row2) {
    const status = {
      status: ComparisionRowStatus.IDLE,
      values: [],
    }
    const maxCols = Math.max(row1.length, row2.length)
    Array.from({length: maxCols}).forEach((_, index) => {
      if (row1[index] === row2[index]) {
        status.values.push({
          value: row1[index],
          changed: false,
          newValue: row1[index],
        })
      } else {
        status.status = ComparisionRowStatus.CHANGED
        status.values.push({
          value: row1[index],
          changed: true,
          newValue: row2[index],
        })
      }
    })
    return status
  }

  _createHashMap (values, {indexColumns}) {
    if (indexColumns && indexColumns.length) {
      return keyBy(values.filter(row => row.some(val => val)), obj => indexColumns.map(col => obj[col]).join('-'))
    } else {
      return values.filter(row => row.some(val => val))
    }
  }
}
