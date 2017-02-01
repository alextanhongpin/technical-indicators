// service/yahoo-finance.js
//
// Description:
// Construct the url query for the given parameters
// and make a call to the yahoo-finance endpoint
// and parse the data to be consumed

class YahooFinanceService extends ServiceInterface {
  constructor ({ symbol = 'AAPL', start, end }) {
    super()
    this._symbol = symbol
    this._start = DateUtil.format(new Date(start))
    this._end = DateUtil.format(new Date(end))
    console.log(this._start, 'this._start')
    console.log(this._end, 'this._end')
  }

  set symbol (value) {
    this._symbol = value
  }
  get symbol () {
    return this._symbol
  }
  set start (value) {
    this._start = DateUtil.format(new Date(value))
  }
  get start () {
    return this._start
  }
  set end (value) {
    this._end = DateUtil.format(new Date(value))
  }
  get end () {
    return this._end
  }

  // build the query
  _buildQuery ({symbol, startDate, endDate}) {
    const query = `select * from yahoo.finance.historicaldata where symbol = "${symbol}" and startDate = "${startDate}" and endDate = "${endDate}"`
    return window.encodeURIComponent(query)
  }
  _buildURL ({query}) {
    return `http://query.yahooapis.com/v1/public/yql?q=${query}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`
  }
  getSymbolFromHash () {
    const hash = window.location.hash
    return hash ? hash.replace('#', '') : 'AAPL'
  }

  fetch () {
    const query = this._buildQuery({
      symbol: this._symbol,
      startDate: this._start,
      endDate: this._end
    })
    const serviceURL = this._buildURL({ query })
    return fetch(serviceURL)
    .then(body => { return body.json() })
    .then((data) => {
      console.log(data)
      if (!data.query.results) {
        return []
      }
      return data.query.results.quote
    })
    .then(this._parseData.bind(this)) // Parse the data
    .then(this._sortByDate) // Sort the data
  }
  _sortByDate (data) {
    return data.sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })
  }
  _parseDatum (datum) {
    return {
      adjusted_close: parseFloat(datum['Adj_Close'], 10),
      close: parseFloat(datum['Close'], 10),
      date: DateUtil.parse(datum['Date']),
      high: parseFloat(datum['High'], 10),
      low: parseFloat(datum['Low'], 10),
      open: parseFloat(datum['Open'], 10),
      volume: parseFloat(datum['Volume'], 10)
    }
  }
  _parseData (data) {
    return data.map(this._parseDatum)
  }
}
// I hate the `new` keyword, so...
// The problem with this is that it is very hard to access the static variables
const YahooFinanceServiceFactory = (props) => {
  return new YahooFinanceService(props)
}
