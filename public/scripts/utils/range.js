// utils/range.js
//
// Description:
// Calculates the range of date and the prior date for
// calculations to take effect
//
// Usage:
// const range = new Range()
//
// const oneMonthRange = range.month({ duration: 1, 150 })
// oneMonthRange.start -> the date where the data will start showing
// oneMonthRange.end -> the date where the data will end
// oneMonthRange.prior -> the data for the following range will be
// taken for calculations (SMA150, RSI14, etc), but will not be displayed
//
class Range {

  constructor () {
    this.ONE_DAY = 1000 * 60 * 60 * 24
    this.ONE_MONTH_DURATION = 31 * this.ONE_DAY
    this.ONE_YEAR_DURATION = 366 * this.ONE_DAY
  }

  // @duration {Number} the number of month(s)
  // @offset {Number} the days to be offsetted, for SMA/RSI calculations
  // Since one week has only 5 trading days, if you want 150 days prior of data
  // then it will be 150 / 5 = 30 weeks
  // number of days = 30 weeks x 7 days = 210 days
  month ({ duration, offset }) {
    const end = new Date().setHours(0, 0, 0, 0)
    const start = end - duration * this.ONE_MONTH_DURATION
    const prior = start - offset * this.ONE_DAY
    return { prior, start, end }
  }

  year ({ duration, offset }) {
    const end = new Date().setHours(0, 0, 0, 0)
    const start = end - duration * this.ONE_YEAR_DURATION
    const prior = start - offset * this.ONE_DAY
    return { prior, start, end }
  }
}

const RangeFactory = (props) => {
  return new Range(props)
}
