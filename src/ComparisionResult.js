/**
 * @typedef ComparisionRow
 * @property {ComparisionRowStatus} status
 * @property {Object[]} values
 */
import ComparisionRowStatus from './helpers/ComparisionRowStatus'
import flatten from 'lodash/flatten'

export default class ComparisionResult {
  /**
   * @param {ComparisionRow[]} rows
   */
  constructor (rows, originalData, comparisionData, options) {
    this._rows = rows
    this.originalData = originalData
    this.comparisionData = comparisionData
    this.options = options
  }

  getAll () {
    return {
      value: this._rows,
      originalData: this.originalData,
      comparisionData: this.comparisionData,
      options: this.options,
    }
  }

  getRemoved () {
    return this._filterStatus(ComparisionRowStatus.REMOVED)
  }

  getAdded () {
    return this._filterStatus(ComparisionRowStatus.ADDED)
  }

  getChanged () {
    return this._filterStatus(ComparisionRowStatus.CHANGED)
  }

  getIdle () {
    return this._filterStatus(ComparisionRowStatus.IDLE)
  }

  getDifferenceList () {
    return flatten(this._rows
        .filter(row => row.status !== ComparisionRowStatus.IDLE)
        .map(row => row.values.filter(cell => cell.changed).map(cell => ({
          difference: [cell.value, cell.newValue],
          row: row.values.map(cell => cell.value),
        }))))
  }

  _filterStatus (status) {
    return {
      value: this._rows.filter(row => row.status === status),
      originalData: this.originalData,
      comparisionData: this.comparisionData,
      options: this.options,
    }
  }
}
