const Papa = require('papaparse')

/**
 * Normalizes raw data into format later used in JsonComparator
 */
export default function transformDataSources (...dataSources) {
  return Promise.all(dataSources.map(_transformSingle))
}

async function _transformSingle(dataSource) {
  return new Promise(resolve => Papa.parse(dataSource, {
    complete (results) {
      return resolve(results.data)
    },
  }))
}
