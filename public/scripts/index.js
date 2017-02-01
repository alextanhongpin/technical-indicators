
// Responsible for parsing the string date
// FROM "2010-02-05"
// TO 1485360000000

const mapRow = (row) => {
  const dateFormat = d3.timeParse('%Y-%m-%d')
  return {
    adjusted_close: parseFloat(row['Adj Close'], 10),
    close: parseFloat(row['Close'], 10),
    date: dateFormat(row['Date']),
    high: parseFloat(row['High'], 10),
    low: parseFloat(row['Low'], 10),
    open: parseFloat(row['Open'], 10),
    volume: parseFloat(row['Volume'], 10)
  }
}

const loadCSV = (url) => {
  return new Promise((resolve, reject) => {
    d3.request(url)
    .mimeType('text/csv')
    .response((xhr) => {
      return d3.csvParse(xhr.responseText, mapRow)
    })
    .get((csv) => {
      resolve(csv)
    })
  })
}

const width = 960
const height = 500
const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
}

const svg = d3.select('#chart')
.append('svg')
.attr('width', width)
.attr('height', height)

const x = d3.scaleTime()
.rangeRound([0, width - margin.left - margin.right])
const y = d3.scaleLinear()
.rangeRound([height - margin.top - margin.bottom, 0])

const line = d3.line()
.x(d => x(d.date))
.y(d => y(d.close))

const g = svg.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`)

const csvURL = 'http://localhost:4000/data/ql-resources/2017-01-27-ql-resources.csv'
loadCSV(csvURL).then((data) => {
  x.domain(d3.extent(data, d => d.date))
  y.domain(d3.extent(data, d => d.close))

  g.append('g')
    .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
    .call(d3.axisBottom(x))
    .select('.domain')
    .remove()

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Price ($)')

  g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line)
})
