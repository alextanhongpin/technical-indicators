
const loadCSV = (url) => {
  return new Promise((resolve, reject) => {
    d3.request(url)
    .mimeType('text/csv')
    .response((xhr) => {
      return d3.csvParse(xhr.responseText)
    })
    .get((csv) => {
      resolve(csv)
    })
  })
}
