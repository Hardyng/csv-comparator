/**
 * Class which performs comparing between arrays of values
 */
class JsonComparator {
  /**
   * @param {String[][][]} source
   * Sets initial config later used for comparision
   * @param options
   */
  constructor (source = [], options = {
    allowExtraRows: false,
    allowExtraColumns: false,
    allowEmptyCells: false,
    cellsEqualityFn: null,
  }) {
    this.allowExtraRows = options.allowExtraRows
    this.allowExtraColumns = options.allowExtraColumns
    this.allowEmptyCells = options.allowEmptyCells
    this.cellsEqualityFn = options.cellsEqualityFn
    this.source = source
    this.result = null
    this.tableResult = source ? this._createTable(source[0]) : source

    this.compare = this.compare.bind(this)
    this._cellValuesAreEqual = this._cellValuesAreEqual.bind(this)
    this._getCellValues = this._getCellValues.bind(this)
    this._getNumberOfRows = this._getNumberOfRows.bind(this)
    this._getNumberOfColumns = this._getNumberOfColumns.bind(this)
  }

  _createTable () {
    const maxNumberOfRows = this._getNumberOfRows()
    const numberOfColumns = this._getNumberOfColumns()
    const arr = []
    Array.from({length: maxNumberOfRows}).forEach((row, rowIndex) => {
      arr.push([])

      Array.from({length: numberOfColumns}).forEach((cell, columnIndex) => {
        const value = (this.source[0][rowIndex] || [])[columnIndex] || null
        arr[rowIndex].push({
          value,
          isDifferent: false,
          difference: null,
        })
      })
    })
    return arr
  }
  get asList () {
    return {
      sources: this.source,
      difference: this.result,
    }
  }

  get asTable () {
    return {
      sources: this.source,
      table: this.tableResult,
    }
  }
  /**
   * @returns {Promise<{ rowIndex: Number, columnIndex: Number, difference: String[] }[]>}
   */
  compare () {
    const differentRows = []
    const maxNumberOfRows = this._getNumberOfRows()
    const numberOfColumns = this._getNumberOfColumns()

    Array.from({length: maxNumberOfRows}).forEach((row, rowIndex) => {
      Array.from({length: numberOfColumns}).forEach((cell, columnIndex) => {
        const cellValues = this._getCellValues(rowIndex, columnIndex)
        if (!this._cellValuesAreEqual(cellValues)) {
          if (this.tableResult[rowIndex] && this.tableResult[rowIndex][columnIndex]) {
            this.tableResult[rowIndex][columnIndex].difference = cellValues
            this.tableResult[rowIndex][columnIndex].isDifferent = true
          }
          differentRows.push({
            rowIndex,
            columnIndex,
            difference: cellValues,
          })
        }
      })
    })
    this.result = differentRows
    return this
  }

  _cellValuesAreEqual (cellValues) {
    if (this.cellsEqualityFn) {
      return this.cellsEqualityFn(cellValues)
    }
    if (cellValues.length === 1) {
      return false
    }
    if (this.allowEmptyCells) {
      cellValues = cellValues.filter(cell => cell)
    }
    return new Set(cellValues).size <= 1
  }

  /**
   * @param {Number} row
   * @param {Number} cell
   * @returns {String[]}
   * @private
   */
  _getCellValues (row, cell) {
    const getValueFromDataSource = dataSource => ((dataSource[row] || [])[cell]) || null
    return this.source.map(getValueFromDataSource)
  }

  /**
   * @returns {Number}
   * @private
   */
  _getNumberOfRows () {
    if (this.allowExtraRows) {
      return Math.min(...this.source.map(arr => arr.length))
    } else {
      return Math.max(...this.source.map(arr => arr.length))
    }
  }

  /**
   * @returns {Number}
   * @private
   */
  _getNumberOfColumns () {
    if (this.allowExtraColumns) {
      return Math.min(...this.source.map(arr => (arr[0] || []).length))
    } else {
      return Math.max(...this.source.map(arr => (arr[0] || []).length))
    }
  }
}

export default JsonComparator
