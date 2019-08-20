const csv = require('csvtojson')

/**
 * Normalizes raw data into format later used in JsonComparator
 */
class CsvTransformer {
  constructor (csvToJsonOptions = {delimiter: ','}) {
    this.options = Object.assign({
      noheader: true,
      output: 'csv',
      delimiter: ',',
    }, csvToJsonOptions)

    this.transform = this.transform.bind(this)
    this.transformSingle = this.transformSingle.bind(this)
  }

  transform (dataSources) {
    return Promise.all(dataSources.map(this.transformSingle))
  }

  transformSingle (dataSource) {
    if (typeof dataSource === 'string' || dataSource.constructor.name === 'Buffer') {
      return csv(this.options).fromString(dataSource.toString())
    } else {
      throw Error('Unrecognized argument type')
    }
  }
}

export default CsvTransformer
