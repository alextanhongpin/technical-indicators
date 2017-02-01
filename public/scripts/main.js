
// Bad global example :)
let svg = null

// Setup range
const range = RangeFactory()
const oneMonthRange = range.month({
  duration: 1, // One month duration
  offset: 210 // 150 days offset, which is 150 / 5 * 7
})

// Setup service
const yahooFinanceService = YahooFinanceServiceFactory({
  start: oneMonthRange.prior,
  end: oneMonthRange.end
})
const loaderView = document.getElementById('loader')
// Setup indicators
const sma150 = Indicators.sma('sma150', 150)
const sma50 = Indicators.sma('sma50', 50)
const rsi14 = Indicators.rsi('rsi14', 14)
const mfi14 = Indicators.mfi('mfi14', 14)
const adl = Indicators.adl('adl')

// A working example with the base chart
// const csvURL = 'http://localhost:4000/data/ql-resources/2017-01-27-ql-resources.csv'
window.addEventListener('hashchange', () => {
  loaderView.innerHTML = 'Loading...'
  buildChart()
}, false)

buildChart()

function buildChart () {
  yahooFinanceService.symbol = yahooFinanceService.getSymbolFromHash()
  yahooFinanceService.fetch()
  .then((data) => {
    // Apply indicators
    data = sma50(data)
    data = sma150(data)
    data = rsi14(data)
    data = mfi14(data)
    data = adl(data)

    // Only display data within the range
    data = data.filter((d) => {
      return d.date.getTime() >= oneMonthRange.start
    })

    if (svg) {
      d3.select('svg').remove()
      svg.context.remove()
      svg = null
    }
    svg = new SVGChart({
      el: '#chart'
    })
    const DIMENSIONS = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    }
    const MINIMAP_DIMENSIONS = {
      top: 400,
      right: 20,
      bottom: 30,
      left: 40
    }
    // In ES7, just destructure the dimension
    // {
    //   ...dimensions
    // }
    const axis = new Axis(Object.assign({}, DIMENSIONS, {
      yLabel: 'Closing Price ($)',
      xAxisHook: d => d.date,
      yAxisHook: d => d.close
    }))
    const crosshair = new Crosshair(Object.assign({}, DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.close
    }))

    const lineChart1 = new LineChart(Object.assign({}, DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.close,
      stroke: 'lightblue'
    }))

    const sma150Line = new LineChart(Object.assign({}, DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.sma150,
      stroke: 'green'
      // mapper: sma150
    }))
    const sma50Line = new LineChart(Object.assign({}, DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.sma50,
      stroke: 'red'
      // mapper: sma50
    }))

    const rsi14Line = new LineChart(Object.assign({}, MINIMAP_DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.rsi14,
      stroke: 'red'
      // mapper: rsi14
    }))

    const mfi14Line = new LineChart(Object.assign({}, MINIMAP_DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.mfi14,
      stroke: 'pink',
      strokeWidth: 1.5
      // mapper: mfi14
    }))
    const adlLine = new LineChart(Object.assign({}, MINIMAP_DIMENSIONS, {
      xAxisHook: d => d.date,
      yAxisHook: d => d.adl,
      stroke: 'purple',
      strokeWidth: 1.5
      // mapper: adl
    }))

    svg.register('axis', axis)
    svg.register('line-chart1', lineChart1)
    svg.register('sma150line', sma150Line)
    svg.register('sma50line', sma50Line)
    svg.register('rsi14Line', rsi14Line)
    svg.register('mfi14Line', mfi14Line)
    svg.register('adlLine', adlLine)
    svg.register('crosshair', crosshair)

    svg.render(data)

    loaderView.innerHTML = ''
    d3.select('#max').on('click', () => {
      svg.render(data.splice(data.length - 150, 150))
    })

    // setTimeout(() => {
    //   svg.unregister('sma50line')
    // }, 3000)
  })
}
