"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compareSources;

var _ComparisionResult = _interopRequireDefault(require("./ComparisionResult"));

var _DataSourceHashMap = _interopRequireDefault(require("./DataSourceHashMap"));

var _ComparisionRowStatus = _interopRequireDefault(require("./helpers/ComparisionRowStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compareSources(source1, source2, options = {
  indexColumns: null
}) {
  const tableResult = [];
  const hashMap = new _DataSourceHashMap.default(source1, options);
  const comparisionHashMap = new _DataSourceHashMap.default(source2, options); // insert edited

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
        value: null,
        changed: true,
        newValue: cell
      }))
    };
    tableResult.splice(positionIndex + 1, 0, status);
  });
  return new _ComparisionResult.default(tableResult, source1, source2, options);
}