"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compareSources;

var _ComparisionResult = _interopRequireDefault(require("./ComparisionResult"));

var _DataSourceHashMap = _interopRequireDefault(require("./DataSourceHashMap"));

var _ComparisionRowStatus = _interopRequireDefault(require("./helpers/ComparisionRowStatus"));

var _fill = _interopRequireDefault(require("lodash/fill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compareSources(source1, source2, options = {
  indexColumns: null,
  trackColumns: null,
  firstRowIsHeader: false
}) {
  const tableResult = []; // Find how many columns there are

  const maxCols1 = Math.max(...source1.map(arr => arr.length));
  const maxCols2 = Math.max(...source2.map(arr => arr.length));
  const maxCols = Math.max(maxCols1, maxCols2); // Fill array with empty values to adjust to added columns

  source1 = source1.map(arr => [...arr, ...(0, _fill.default)(Array(maxCols - arr.length), '')]);
  source2 = source2.map(arr => [...arr, ...(0, _fill.default)(Array(maxCols - arr.length), '')]);
  const hashMap = new _DataSourceHashMap.default(source1.slice(options.firstRowIsHeader ? 1 : 0), options);
  const comparisionHashMap = new _DataSourceHashMap.default(source2.slice(options.firstRowIsHeader ? 1 : 0), options); // insert edited

  hashMap.asArray.forEach(({
    index,
    value
  }) => {
    const comparisionRow = comparisionHashMap.getRow(index); // handle removed

    if (comparisionRow) {
      const comparision = _DataSourceHashMap.default.compare(value, comparisionRow);

      tableResult.push(comparision);
    } else {
      tableResult.push({
        status: _ComparisionRowStatus.default.REMOVED,
        values: value.map(cell => ({
          value: cell,
          changed: true,
          newValue: null
        }))
      });
    }
  }); // handle added

  const addedRows = comparisionHashMap.asArray.filter(({
    index
  }) => !hashMap.getRow(index));
  addedRows.forEach(({
    positionIndex,
    index,
    value
  }) => {
    const status = {
      status: _ComparisionRowStatus.default.ADDED,
      values: value.map(cell => ({
        value: cell,
        changed: true,
        oldValue: cell
      }))
    };
    tableResult.splice(positionIndex + 1, 0, status);
  });
  return new _ComparisionResult.default(tableResult, source1, source2, options);
}