"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compare;

var _compareSources = _interopRequireDefault(require("./compareSources"));

var _transformDataSources = _interopRequireDefault(require("./transformDataSources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param dataSource1
 * @param dataSource2
 * @param options
 */
async function compare(dataSource1, dataSource2, options) {
  const sourceArrays = await (0, _transformDataSources.default)(dataSource1, dataSource2);
  return (0, _compareSources.default)(...sourceArrays, options);
}