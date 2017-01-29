
var svg = d3.select('svg'),
  margin = {top: 20, right: 20, bottom: 110, left: 40},
  margin2 = {top: 430, right: 20, bottom: 30, left: 40},
  width = +svg.attr('width') - margin.left - margin.right,
  height = +svg.attr('height') - margin.top - margin.bottom,
  height2 = +svg.attr('height') - margin2.top - margin2.bottom
const dateFormat = d3.timeParse('%Y-%m-%d')

var parseDate = d3.timeParse('%b %Y')

var x = d3.scaleTime().range([0, width]),
  x2 = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  y2 = d3.scaleLinear().range([height2, 0])

var xAxis = d3.axisBottom(x),
  xAxis2 = d3.axisBottom(x2),
  yAxis = d3.axisLeft(y)

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', brushed)

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed)

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x(d.date) })
    .y0(height)
    .y1(function (d) { return y(d.close) })

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x2(d.date) })
    .y0(height2)
    .y1(function (d) { return y2(d.close) })

svg.append('defs').append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height)

var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')')

const csvURL = 'http://localhost:4000/data/ql-resources/2017-01-27-ql-resources.csv'

const mapRow = (row) => {
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

const smaX = d3.scaleTime()
.range([0, width])
const smaY = d3.scaleLinear()
.range([height, 0])

const line = d3.line()
.x(d => smaX(d.date))
.y(d => smaY(d.sma))

const smaMapper = (sma, data) => {
  return (row, index) => {
    if (index < sma) {
      row.sma = 0
      return row
    } else {
      const copy = [...data]
      const range = copy.slice(index - sma, index)
      const average = range.reduce((total, val) => {
        return total + val.close
      }, 0) / sma

      row.sma = average
      return row
    }
  }
}

d3.csv(csvURL, type, function (error, data) {
  if (error) throw error
  const rawData = [...data]

  data = [...data].map(mapRow)

  x.domain(d3.extent(data, function (d) { return d.date }))
  y.domain([0, d3.max(data, function (d) { return d.close })])
  x2.domain(x.domain())
  y2.domain(y.domain())

  focus.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area)

  focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

  focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis)

  context.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area2)

  context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height2 + ')')
      .call(xAxis2)

  context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range())

  // PLOT SMA

  let copy = [...rawData].map(mapRow).sort((a, b) => {
    // Sort by timestamp
    return a.date.getTime() - b.date.getTime()
  })
  sma14Mapper = smaMapper(150, copy)
  const smaData = [...copy].map(sma14Mapper)

  smaX.domain(d3.extent(smaData, d => d.date))
  smaY.domain(d3.extent(smaData, d => d.sma))

  focus.append('path')
      .datum(smaData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('class', 'line')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line)

  svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom)
})

function brushed () {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom
  var s = d3.event.selection || x2.range()
  x.domain(s.map(x2.invert, x2))
  focus.select('.area').attr('d', area)
  focus.select('.axis--x').call(xAxis)
  svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0))

  smaX.domain(s.map(x2.invert, x2))
  focus.select('.line').attr('d', line)

  // smaY.domain(d3.extent(copy, d => d.sma))
}

function zoomed () {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return // ignore zoom-by-brush
  var t = d3.event.transform
  x.domain(t.rescaleX(x2).domain())
  focus.select('.area').attr('d', area)
  focus.select('.axis--x').call(xAxis)
  context.select('.brush').call(brush.move, x.range().map(t.invertX, t))

  smaX.domain(t.rescaleX(x2).domain())
  focus.select('.line').attr('d', line)
}

function type (d) {
  d.date = d.date
  d.close = +d.close
  d.sma = 0
  return d
}
