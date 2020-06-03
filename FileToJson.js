/**
 * Run node FileToJson.js filename(test1.csv or test2.xlsm)
 * node FileToJson.js test1.csv
 * node FileToJson.js test2.xlsm
 */

/*
 * 输入文件：
 * csv or excel
 * e.g
 * key	        de	          it
 * Test Drive	  Proefrit	    Essai de Conduite
 * csv or excel
 * 生成格式
 * {
 *      zh: {
 *          'Test Drive': '姓名',
 *      },
 *      de: {
 *          'Test Drive': 'Proefrit',
 *      },
 *      it: {
 *          'Test Drive': 'Essai de Conduite'
 *      }
 *  }
 *
 *
 */
if (process.argv.length !== 3) {
  console.log(
    'Missing csv or excel file,please run node FileToJson.js xxx.csv(xlsm)'
  )
  return
}
const filePath = process.argv[2]
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const csvtojsonV2 = require('csvtojson/v2')
const csv = require('csvtojson')

console.log('Processing ' + filePath)
function readXls() {
  return readXlsxFile(filePath).then((rows) => {
    let titleRow = rows[0]
    let allLanguages = {}
    let titles = []
    for (let i = 0; i < titleRow.length; i++) {
      titles.push(titleRow[i])
      i > 0 && (allLanguages[titleRow[i]] = {})
    }
    for (let i = 1; i < rows.length; i++) {
      let row = rows[i]
      for (let j = 1; j < row.length; j++) {
        if (row[0]) {
          allLanguages[titles[j]][row[0]] = row[j]
        }
      }
    }
    return allLanguages
  })
}

function readCSV() {
  const csvFilePath = filePath
  return csv()
    .fromFile(csvFilePath)
    .then((dataList) => {
      if (!dataList.length) {
        return {}
      }
      let allLanguages = {}
      let item = dataList[0]
      for (let key in item) {
        if (key !== 'key') {
          allLanguages[key] = {}
        }
      }
      for (let item of dataList) {
        for (let key in item) {
          if (key !== 'key' && item.key) {
            allLanguages[key][item.key] = item[key]
          }
        }
      }
      return allLanguages
    })
}

let isCSV = /\.csv$/.test(filePath)
let read = isCSV ? readCSV : readXls
read().then((data) => {
  let outputFileName = filePath.replace(/\.[^.]+$/, '') + '.json'
  fs.writeFileSync(outputFileName, JSON.stringify(data, null, 4), 'utf-8')
  console.log('Success! Output file: ' + outputFileName)
})
