"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const Papa = require('papaparse');
/**
 * Normalizes raw data into format later used in JsonComparator
 */


class CsvTransformer {
  constructor({
    header = false,
    skipEmptyLines = false,
    delimiter = ''
  } = {}) {
    this.options = {
      header,
      delimiter,
      skipEmptyLines
    };
    this.transform = this.transform.bind(this);
    this.transformSingle = this.transformSingle.bind(this);
  }

  transform(dataSources) {
    return Promise.all(dataSources.map(this.transformSingle));
  }

  async transformSingle(dataSource) {
    return new Promise(resolve => Papa.parse(dataSource, { ...this.options,

      complete(results) {
        return resolve(results.data);
      }

    }));
  }

}

var _default = CsvTransformer;
exports.default = _default;