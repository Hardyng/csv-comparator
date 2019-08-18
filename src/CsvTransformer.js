const csv = require('csvtojson')
class CsvTransformer {
  async transform (dataSources) {
    return await Promise.all(dataSources.map(source => csv({
      noheader: true,
      output: 'csv',
    }).fromString(source)))
  }
}

export default new CsvTransformer()
