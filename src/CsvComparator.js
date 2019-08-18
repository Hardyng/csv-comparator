import JsonComparator from './JsonComparator'
import CsvTransformer from './CsvTransformer'
/**
 * TODO: Class description
 */
export default class CsvComparator {
  /**
   * @param {Object} options
   */
  constructor (options = {}) {
    this.options = options
  }

  /**
   * @param {...(String|Object)|String[]|Object[]} dataSources
   * @return {{success: boolean, differentRows: []}}
   */
  async compare (...dataSources) {
    if (dataSources == null) {
      throw Error('Must provide arguments')
    }

    const sourceArrays = await CsvTransformer.transform(dataSources)
    const differentRows = await new JsonComparator(sourceArrays).compare()
    return {
      differentRows,
      success: true,
    }
  }
}
