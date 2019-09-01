"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformDataSources;

const Papa = require('papaparse');
/**
 * Normalizes raw data into format later used in JsonComparator
 */


function transformDataSources(...dataSources) {
  return Promise.all(dataSources.map(_transformSingle));
}

async function _transformSingle(dataSource) {
  return new Promise(resolve => {
    if (Array.isArray(dataSource)) {
      return resolve(dataSource);
    } else {
      Papa.parse(dataSource, {
        complete(results) {
          return resolve(results.data);
        }

      });
    }
  });
}