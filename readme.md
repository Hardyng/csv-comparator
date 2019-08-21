# csv-comparator
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![version](https://img.shields.io/badge/version-0.0.1-yellow.svg)](https://semver.org)

Compares csv files and string in browser. While library is under development I recommend [papaparse](https://www.papaparse.com/), [csvtojson](https://www.npmjs.com/package/csvtojson) or [csv-parse](https://www.npmjs.com/package/csv-parse)

## Installation
```sh
$ npm install csv-comparator
```

## Usage

```js
import CsvComparator from 'csv-comparator'

const comparator = new CsvComparator()

comparator.compare(file1, file2).then(result => {
  console.log(result) // => [{ cellIndex: 0, rowIndex: 0, differences: ['value1', 'value2'] }]
})
```
