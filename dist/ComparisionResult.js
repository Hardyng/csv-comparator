"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ComparisionRowStatus = _interopRequireDefault(require("./helpers/ComparisionRowStatus"));

var _flatten = _interopRequireDefault(require("lodash/flatten"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef ComparisionRow
 * @property {ComparisionRowStatus} status
 * @property {Object[]} values
 */
class ComparisionResult {
  /**
   * @param {ComparisionRow[]} rows
   */
  constructor(rows, originalData, comparisionData, options) {
    this._rows = rows;
    this.originalData = originalData;
    this.comparisionData = comparisionData;
    this.options = options;
  }

  getAll() {
    return {
      value: this._rows,
      originalData: this.originalData,
      comparisionData: this.comparisionData,
      options: this.options
    };
  }

  getRemoved() {
    return this._filterStatus(_ComparisionRowStatus.default.REMOVED);
  }

  getAdded() {
    return this._filterStatus(_ComparisionRowStatus.default.ADDED);
  }

  getChanged() {
    return this._filterStatus(_ComparisionRowStatus.default.CHANGED);
  }

  getIdle() {
    return this._filterStatus(_ComparisionRowStatus.default.IDLE);
  }

  getDifferenceList() {
    return (0, _flatten.default)(this._rows.filter(row => row.status !== _ComparisionRowStatus.default.IDLE).map(row => row.values.filter(cell => cell.changed).map(cell => ({
      difference: [cell.value, cell.newValue],
      row: row.values.map(cell => cell.value)
    }))));
  }

  _filterStatus(status) {
    return {
      value: this._rows.filter(row => row.status === status),
      originalData: this.originalData,
      comparisionData: this.comparisionData,
      options: this.options
    };
  }

}

exports.default = ComparisionResult;