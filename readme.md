# csv-comparator
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![version](https://img.shields.io/badge/version-0.1.0-yellow.svg)](https://semver.org)

Compares csv files and string in browser. Also check out:
- [papaparse](https://www.papaparse.com/),
- [csvtojson](https://www.npmjs.com/package/csvtojson)
- [csv-parse](https://www.npmjs.com/package/csv-parse)

## Usage

```js
import compare from 'csv-comparator'

const result = compare(file, otherFile, {
    indexColumns
}).then(comparision => {
  const allData = comparision.getAll()
  console.log(allData.value) // => [{ status: 'CHANGED', values: [{changed: true, oldValue: '3', newValue: '2'}] }]
  console.log(allData.originalData) // first file
  console.log(allData.comparisionData) // second file
  console.log(allData.options) // { indexColumns }
})
```
