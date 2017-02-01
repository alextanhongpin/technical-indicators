
const rangeOfDays = (data, start, days) => {
  return [...data].slice(start - days, start)
}
const sumOfClosingPrice = (data) => {
  return data.reduce((total, d) => {
    return total + d.close
  }, 0)
}
const sumOfChange = (data) => {
  const hasData = data && data.length
  if (!hasData) {
    return 0
  }
  return data.reduce((total, d) => {
    return total + parseFloat(d.change, 10)
  }, 0)
}
const sumOfMoneyFlow = (data) => {
  return data.reduce((total, d) => {
    return total + d.moneyFlow
  }, 0)
}

const Indicators = {
  // Simple-Moving-Average
  sma (name, days = 50) {
    return (data) => {
      return data
      .map((row, index) => {
        // Only apply calculation when there
        // is enough data points
        if (index < days) {
          row[name] = 0
        } else {
          // Get the sum of the range
          const range = rangeOfDays(data, index, days)
          // Get the sum of the closing value divided by the number of days
          const sma = sumOfClosingPrice(range) / days
          row[name] = sma
        }
        return row
      })
    }
  },
  // Relative-Strength-Index
  rsi (name, days = 14) {
    return (data) => {
      // Precalculations
      const mappedData = data.map((d, index) => {
        const currentClose = d.close
        const previousClose = data[index - 1]
        if (previousClose) {
          d.change = currentClose - previousClose.close
        } else {
          d.change = 0
        }
        return d
      })
      return mappedData.map((row, index) => {
        if (index < days) {
          row[name] = 0
        } else {
          const range = rangeOfDays(data, index, days)
          const averageGain = sumOfChange(range.filter(d => { return d.change > 0 }))
          const averageLoss = sumOfChange(range.filter(d => { return d.change < 0 }))
          const rs = Math.abs(averageGain / averageLoss)
          const rsiValue = 100 - 100 / (1 + rs)
          row[name] = rsiValue
        }
        return row
      })
    }
  },

  // Accumulation-Distribution-Line (ADL)
  adl (name) {
    return (data) => {
      return data.map((m, i) => {
        if (data[i - 1]) {
          const moneyFlowMultiplier = ((m.close - m.low) - (m.high - m.close)) / (m.high - m.low)
          const moneyFlowVolume = isNaN(moneyFlowMultiplier) ? 0 : moneyFlowMultiplier * m.volume
          const previousADL = data[i - 1].adl ? data[i - 1].adl : 0
          m.adl = previousADL + moneyFlowVolume
        } else {
          m.adl = 0
        }
        return m
      })
    }
  },

// Money-Flow-Index mapper
  mfi (name, days = 14) {
    return (data) => {
      const mappedData = data.map((m, i) => {
        if (data[i - 1]) {
          const typicalPrice = (m.high + m.low + m.close) / 3

          const rawMoneyFlow = typicalPrice * m.volume
          m.moneyFlow = rawMoneyFlow
          m.change = m.close - data[i - 1].close
        } else {
          m.change = 0
          m.moneyFlow = 0
        }
        return m
      })

      return mappedData.map((row, index) => {
        if (index < days) {
          row[name] = 0
        } else {
          const range = rangeOfDays(data, index, days)
          const positiveMoneyFlow = sumOfMoneyFlow(range.filter(d => d.change > 0))
          const negativeMoneyFlow = sumOfMoneyFlow(range.filter(d => d.change < 0))

          const mf = Math.abs(positiveMoneyFlow / negativeMoneyFlow)
          let mfiValue = 100 - 100 / (1 + mf)
          if (isNaN(mfiValue)) {
            mfiValue = 0
          }
          row[name] = mfiValue
        }
        return row
      })
    }
  }
}
