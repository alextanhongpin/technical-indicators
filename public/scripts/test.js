
// A working example with the base chart
const csvURL = 'http://localhost:4000/data/ql-resources/2017-01-27-ql-resources.csv'

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

const smaMapper = (name, sma) => {
  return (data) => {
    return data.sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    }).map((row, index) => {
      if (index < sma) {
        row[name] = 0
        return row
      } else {
        const copy = [...data]
        const range = copy.slice(index - sma, index)
        const average = range.reduce((total, val) => {
          return total + val.close
        }, 0) / sma

        row[name] = average
        return row
      }
    })
  }
}
// Money-Flow-Index mapper
const mfiMapper = (name, period = 14) => {
  return (data) => {
    const copy = [...data]
    const sorted = copy.sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })

    const applyChange = copy.map((m, i) => {
      if (copy[i - 1]) {
        const typicalPrice = (m.high + m.low + m.close) / 3

        const rawMoneyFlow = typicalPrice * m.volume
        m.moneyFlow = rawMoneyFlow
        m.change = m.close - copy[i - 1].close
      } else {
        m.change = 0
        m.moneyFlow = 0
      }
      return m
    })

    return applyChange.map((row, index) => {
      if (index < period) {
        row[name] = 0
        return row
      } else {
        const copy = [...data]
        const range = copy.slice(index - period, index)
        const positiveMoneyFlow = range
        .filter(d => d.change > 0)
        .reduce((total, val) => {
          return total + val.moneyFlow
        }, 0)
        const negativeMoneyFlow = range
        .filter(d => d.change < 0)
        .reduce((total, val) => {
          return total + val.moneyFlow
        }, 0)
        const mf = Math.abs(positiveMoneyFlow) / Math.abs(negativeMoneyFlow)
        let mfiValue = 100 - 100 / (1 + mf)
        if (isNaN(mfiValue)) {
          mfiValue = 0
        }
        row[name] = mfiValue
        return row
      }
    })
  }
}

const rsiMapper = (name, rsi = 14) => {
  return (data) => {
    const copy = [...data]
    const sorted = copy.sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })

    const applyChange = copy.map((m, i) => {
      if (copy[i - 1]) {
        m.change = m.close - copy[i - 1].close
      } else {
        m.change = 0
      }
      return m
    })

    return applyChange.map((row, index) => {
      if (index < rsi) {
        row[name] = 0
        return row
      } else {
        const copy = [...data]
        const range = copy.slice(index - rsi, index)
        const averageGain = range
        .filter(d => d.change > 0)
        .reduce((total, val) => {
          return total + val.change
        }, 0)
        const averageLoss = range
        .filter(d => d.change < 0)
        .reduce((total, val) => {
          return total + val.change
        }, 0)
        const rs = Math.abs(averageGain) / Math.abs(averageLoss)
        const rsiValue = 100 - 100 / (1 + rs)
        row[name] = rsiValue
        return row
      }
    })
  }
}
// Accumulation-Distribution-Line (ADL)

const adlMapper = (name) => {
  return (data) => {
    const copy = [...data]
    const sorted = copy.sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })

    return copy.map((m, i) => {
      if (copy[i - 1]) {
        const moneyFlowMultiplier = ((m.close - m.low) - (m.high - m.close)) / (m.high - m.low)
        const moneyFlowVolume = isNaN(moneyFlowMultiplier) ? 0 : moneyFlowMultiplier * m.volume
        const previousADL = copy[i - 1].adl ? copy[i - 1].adl : 0
        m.adl = previousADL + moneyFlowVolume
      } else {
        m.adl = 0
      }
      return m
    })
  }
}

loadCSV(csvURL)
.then(data => data.map(mapRow)) // Parse the csv json
.then((data) => {
  const sma150 = smaMapper('sma150', 150)
  // const sma50 = smaMapper('sma50', 50)
  // const rsi14 = rsiMapper('rsi14', 14)
  // const mfi14 = mfiMapper('mfi14', 14)
  // const adl = adlMapper('adl')

  // data = sma50(data)
  data = sma150(data)
  // data = rsi14(data)
  // data = mfi14(data)
  // data = adl(data)

  console.log(data)
  const svg = new SVGChart({
    el: '#chart'
  })
  const axis = new Axis({
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
    yLabel: 'Closing Price ($)',
    xAxisHook: d => d.date,
    yAxisHook: d => d.close,
    yAxisLabelColor: '#333'
  })
  const crosshair = new Crosshair({
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
    xAxisHook: d => d.date,
    yAxisHook: d => d.low
  })
  const lineChart1 = new LineChart({
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
    yLabel: 'Closing Price ($)',
    xAxisHook: d => d.date,
    yAxisHook: d => d.low,
    stroke: 'blue',
    strokeWidth: 1.5,
    disableXAxis: true, // Share the same axis
    disableYAxis: true
  })
  const sma150Line = new LineChart({
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
    yLabel: 'Closing Price ($)',
    xAxisHook: d => d.date,
    yAxisHook: d => d.sma150,
    stroke: 'green',
    strokeWidth: 1.5,
    disableXAxis: true, // Share the same axis
    disableYAxis: true
  })
  const sma50Line = new LineChart({
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
    yLabel: 'Closing Price ($)',
    xAxisHook: d => d.date,
    yAxisHook: d => d.sma50,
    stroke: 'red',
    strokeWidth: 1.5,
    disableXAxis: true, // Share the same axis
    disableYAxis: true
  })

  const rsi14Line = new LineChart({
    top: 400,
    right: 20,
    bottom: 30,
    left: 40,
    xAxisHook: d => d.date,
    yAxisHook: d => d.rsi14,
    stroke: 'red',
    strokeWidth: 1.5
  })

  const mfi14Line = new LineChart({
    top: 400,
    right: 20,
    bottom: 30,
    left: 40,
    xAxisHook: d => d.date,
    yAxisHook: d => d.mfi14,
    stroke: 'blue',
    strokeWidth: 1.5
  })
  const adlLine = new LineChart({
    top: 400,
    right: 20,
    bottom: 30,
    left: 40,
    xAxisHook: d => d.date,
    yAxisHook: d => d.adl,
    stroke: 'blue',
    strokeWidth: 1.5
  })

  svg.register('axis', axis)
  svg.register('line-chart1', lineChart1)
  svg.register('sma150line', sma150Line)
  // svg.register('sma50line', sma50Line)
  // svg.register('rsi14Line', rsi14Line)
  // svg.register('mfi14Line', mfi14Line)
  // svg.register('adlLine', adlLine)
  svg.register('crosshair', crosshair)
  svg.render(data)

  d3.select('#max').on('click', () => {
    console.log(data.splice(data.length - 150, 150))
    svg.render(data.splice(data.length - 150, 150))
  })

  // setTimeout(() => {
  //   svg.unregister('sma50line')
  // }, 3000)
})
