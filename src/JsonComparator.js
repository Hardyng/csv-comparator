import get from 'lodash/get'
import uniq from 'lodash/uniq'

class JsonComparator {
  /**
   * @param {String[][][]} values
   */
  constructor (values) {
    this._values = values
  }
  /**
   * @returns {Promise<{ rowIndex: Number, cellIndex: Number, difference: String[] }[]>}
   */
  async compare () {
    const differentRows = []
    const maxNumberOfRows = this._getMaxNumberOfRows()
    const numberOfColumns = (get(this._values, '0.0') || []).length

    Array.from({length: maxNumberOfRows}).forEach((row, rowIndex) => {
      Array.from({length: numberOfColumns}).forEach((cell, cellIndex) => {
        const cellValues = this._getCellValues(rowIndex, cellIndex)
        if (this._cellValuesAreNotEqual(cellValues)) {
          differentRows.push({
            rowIndex,
            cellIndex,
            difference: cellValues,
          })
        }
      })
    })

    return differentRows
  }

  _cellValuesAreNotEqual (cellValues) {
    return uniq(cellValues).length !== 1
  }

  /**
   * @param {Number} row
   * @param {Number} cell
   * @returns {String[]}
   * @private
   */
  _getCellValues (row, cell) {
    const parseSource = dataSource => get(dataSource, `${row}.${cell}`) || ''
    return this._values.map(parseSource)
  }

  _getMaxNumberOfRows () {
    return Math.max(...this._values.map(arr => arr.length))
  }
}

export default JsonComparator
