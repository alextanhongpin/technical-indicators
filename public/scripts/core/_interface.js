// Default values

const EMPTY_HOOK = d => d
const BLACK_COLOR = 'black'
const PRIMARY_COLOR = 'steelblue'
const WIDTH = 960
const HEIGHT = 500

// Description: The base class contains all the properties that
// each chart should inherit to keep the code DRY
class ChartInterface {
  constructor ({
    top = 0,
    right = 0,
    bottom = 0,
    left = 0,
    width = WIDTH,
    height = HEIGHT,

    xLabel = 'x-axis label',
    yLabel = 'y-axis label',
    xAxisClassName = 'axis axis--x',
    yAxisClassName = 'axis axis--y',
    xAxisHook = EMPTY_HOOK,
    yAxisHook = EMPTY_HOOK,

    fill = PRIMARY_COLOR,
    stroke = PRIMARY_COLOR,

    strokeWidth = 1.5,
    disableXAxis = true,
    disableYAxis = true,

    xAxisLineColor = BLACK_COLOR,
    xAxisTickColor = BLACK_COLOR,
    xAxisTextColor = BLACK_COLOR,
    xAxisLabelColor = BLACK_COLOR,

    yAxisLineColor = BLACK_COLOR,
    yAxisTickColor = BLACK_COLOR,
    yAxisTextColor = BLACK_COLOR,
    yAxisLabelColor = BLACK_COLOR,

    mapper = EMPTY_HOOK
  }) {
    this.state = {
      top, right, bottom, left,
      width, height,
      xLabel, yLabel,
      xAxisClassName,
      yAxisClassName,
      xAxisHook,
      yAxisHook,
      fill, stroke, strokeWidth,
      disableXAxis, disableYAxis,
      xAxisLineColor, xAxisTickColor, xAxisTextColor, xAxisLabelColor,
      yAxisLineColor, yAxisTickColor, yAxisTextColor, yAxisLabelColor,
      mapper
    }
    // Stores the SVG Context
    this.context = {}
  }
  _initScale () {
    // Since we are only dealing with time in the x-axis,
    // it is okay to have this method fixed
    const { width, height } = this.state
    this.state.x = d3.scaleTime().range([0, width])
    this.state.y = d3.scaleLinear().range([height, 0])
  }
  _initAxes () {
    const { x, y } = this.state
    this.state.xAxis = d3.axisBottom(x)
    this.state.yAxis = d3.axisLeft(y)
  }

  _initChart () {
    // Write your own implementation of init chart here
  }
  updateAxes (data) {
    const { x, y, xAxisHook, yAxisHook } = this.state
    const xExtent = d3.extent(data, xAxisHook)
    const yExtent = d3.extent(data, yAxisHook)

    const yRange = yExtent[1] - yExtent[0]

    const yPadding = 0.05 * yRange

    // Add padding to the y-axis upper/lower bound
    // to prevent it from 'sticking' to the x-axis
    const yLowerBound = yExtent[0] - yPadding
    const yUpperBound = yExtent[1] + yPadding

    x.domain(xExtent)
    y.domain([yLowerBound, yUpperBound])
  }

  fitChart (parentWidth, parentHeight) {
    // Subtract the padding when drawing the chart
    const { top, right, bottom, left } = this.state
    this.state.width = parentWidth - left - right
    this.state.height = parentHeight - top - bottom
    this.init()
  }

  init () {
    // Init the scales. Must init before initializing the axes
    this._initScale()
    // Init the axes
    this._initAxes()
    // Init the chart (if present)
    this._initChart()
  }
}
