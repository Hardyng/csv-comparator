/**
 * Class which performs comparing between arrays of values
 */
class JsonComparator {
  /**
   * Sets initial config later used for comparision
   * @param options
   */
  constructor (options = {
    allowExtraRows: false,
    allowExtraColumns: false,
    allowEmptyCells: false,
    cellsEqualityFn: null,
  }) {
    this.allowExtraRows = options.allowExtraRows
    this.allowExtraColumns = options.allowExtraColumns
    this.allowEmptyCells = options.allowEmptyCells
    this.cellsEqualityFn = options.cellsEqualityFn

    this.compare = this.compare.bind(this)
    this._cellValuesAreEqual = this._cellValuesAreEqual.bind(this)
    this._getCellValues = this._getCellValues.bind(this)
    this._getNumberOfRows = this._getNumberOfRows.bind(this)
    this._getNumberOfColumns = this._getNumberOfColumns.bind(this)
  }

  /**
   * @param {String[][][]} values
   * @returns {Promise<{ rowIndex: Number, columnIndex: Number, difference: String[] }[]>}
   */
  async compare (values) {
    const differentRows = []
    const maxNumberOfRows = this._getNumberOfRows(values)
    const numberOfColumns = this._getNumberOfColumns(values)

    Array.from({length: maxNumberOfRows}).forEach((row, rowIndex) => {
      Array.from({length: numberOfColumns}).forEach((cell, columnIndex) => {
        const cellValues = this._getCellValues(values, rowIndex, columnIndex)
        if (!this._cellValuesAreEqual(cellValues)) {
          differentRows.push({
            rowIndex,
            columnIndex,
            difference: cellValues,
          })
        }
      })
    })

    return differentRows
  }

  _cellValuesAreEqual (cellValues) {
    if (this.cellsEqualityFn) {
      return this.cellsEqualityFn(cellValues)
    }
    if (this.allowEmptyCells) {
      cellValues = cellValues.filter(cell => cell)
    }
    return new Set(cellValues).size <= 1
  }

  /**
   * @param {String[][][]} values
   * @param {Number} row
   * @param {Number} cell
   * @returns {String[]}
   * @private
   */
  _getCellValues (values, row, cell) {
    const getValueFromDataSource = dataSource => ((dataSource[row] || [])[cell]) || ''
    return values.map(getValueFromDataSource)
  }

  /**
   * @param {String[][][]} values
   * @returns {Number}
   * @private
   */
  _getNumberOfRows (values) {
    if (this.allowExtraRows) {
      return Math.min(...values.map(arr => arr.length))
    } else {
      return Math.max(...values.map(arr => arr.length))
    }
  }

  /**
   * @param {String[][][]} values
   * @returns {Number}
   * @private
   */
  _getNumberOfColumns (values) {
    if (this.allowExtraColumns) {
      return Math.min(...values.map(arr => (arr[0] || []).length))
    } else {
      return Math.max(...values.map(arr => (arr[0] || []).length))
    }
  }
}

export default JsonComparator
