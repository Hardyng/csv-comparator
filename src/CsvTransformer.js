const csv = require('csvtojson')
class CsvTransformer {
  constructor (props) {
    this.transform = this.transform.bind(this)
    this.transformSingle = this.transformSingle.bind(this)
  }

  async transform (dataSources) {
    return await Promise.all(dataSources.map(this.transformSingle))
  }

  transformSingle (dataSource) {
    const csvExtract = csv({
      noheader: true,
      output: 'csv',
    })

    if (typeof dataSource === 'string' || dataSource.constructor.name === 'Buffer') {
      return csvExtract.fromString(dataSource.toString())
    } else {
      throw Error('Unrecognized argument type')
    }
  }
}

export default new CsvTransformer()
