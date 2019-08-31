import compareSources from './compareSources'
import transformDataSources from './transformDataSources'

/**
 * @param dataSource1
 * @param dataSource2
 * @param options
 */
export default async function compare (dataSource1, dataSource2, options) {
  const sourceArrays = await transformDataSources(dataSource1, dataSource2)
  return compareSources(...sourceArrays, options)
}
