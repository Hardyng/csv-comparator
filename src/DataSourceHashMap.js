import _ from 'lodash'

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
    if (this._options.indexColumns) {
      return this._options.indexColumns.map(col => row[col]).join('-')
    } else {
      return rowIndex
    }
  }
  get asArray () {
    return _.toPairs(this._hashMap).map((pair, positionIndex) => ({
      positionIndex,
      index: pair[0],
      value: pair[1],
    }))
  }

  static compare (row1, row2) {
    const status = {
      status: 'IDLE',
      values: [],
    }
    row1.forEach((cell, index) => {
      if (cell === row2[index]) {
        status.values.push({
          value: cell,
          changed: false,
          newValue: undefined,
        })
      } else {
        status.status = 'CHANGED'
        status.values.push({
          value: cell,
          changed: true,
          newValue: row2[index],
        })
      }
    })
    return status
  }

  _createHashMap (values, {indexColumns}) {
    if (indexColumns) {
      return _.keyBy(values, obj => indexColumns.map(col => obj[col]).join('-'))
    } else {
      return values
    }
  }
}
