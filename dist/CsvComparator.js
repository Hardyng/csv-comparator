"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _JsonComparator = _interopRequireDefault(require("./JsonComparator"));

var _CsvTransformer = _interopRequireDefault(require("./CsvTransformer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CsvComparator {
  /**
   * @param {{
   * csvToJsonOptions: CSVParseParam,
   * allowExtraRows: Boolean,
   * allowExtraColumns: Boolean,
   * allowEmptyCells: Boolean
   * cellsEqualityFn: Function
   * }} options
   */
  constructor(options) {
    this.options = Object.assign({
      csvToJsonOptions: {},
      allowExtraRows: false,
      allowExtraColumns: false,
      allowEmptyCells: true,
      cellsEqualityFn: null
    }, options);
    this.csvTransformer = new _CsvTransformer.default(this.options.csvToJsonOptions);
    this.compare = this.compare.bind(this);
  }
  /**
   * Function which takes as input strings or Buffers in format of csv, and returns object with difference between
   * sources
   * @example
   * const comparator = new CsvComparator();
   * comparator.compare('1,2,3,5', '1,2,3,4').then(result => {
   *   console.log(result.success) // => true
   *   console.log(result.difference) // => [{ rowIndex: 0, columnIndex: 3, difference: ['5', '4'] }]
   * })
   * @param {...(String|Buffer)|String[]|Buffer[]} dataSources
   * @return {{success: boolean, difference: Object[]}}
   */


  async compare(...dataSources) {
    if (dataSources == null) {
      throw Error('Must provide arguments');
    }

    const sourceArrays = await this.csvTransformer.transform(dataSources);
    return await new _JsonComparator.default(sourceArrays, {
      allowExtraRows: this.options.allowExtraRows,
      allowExtraColumns: this.options.allowExtraColumns,
      allowEmptyCells: this.options.allowEmptyCells,
      cellsEqualityFn: this.options.cellsEqualityFn
    }).compare();
  }

}

exports.default = CsvComparator;