class BaseChart {
  constructor (props) {
    this.state = {
      top: props.top,
      right: props.right,
      bottom: props.bottom,
      left: props.left,

      xLabel: props.xLabel,
      yLabel: props.yLabel,
      xAxisClass: props.xAxisClass || 'axis axis--x',
      yAxisClass: props.yAxisClass || 'axis axis--y',
      xAxisHook: props.xAxisHook || this.emptyHook,
      yAxisHook: props.yAxisHook || this.emptyHook,
      width: props.width,
      height: props.height,
      fill: props.fill || 'steelblue',
      stroke: props.stroke || 'steelblue',
      strokeWidth: props.strokeWidth || 1.5,
      disableXAxis: props.disableXAxis,
      disableYAxis: props.disableYAxis,
      yAxisLineColor: props.yAxisLineColor || '#000',
      yAxisTickColor: props.yAxisTickColor || '#000',
      yAxisTextColor: props.yAxisTextColor || '#000',
      yAxisLabelColor: props.yAxisLabelColor || '#000'
    }
  }
  setupScale () {
    // Since we are only dealing with time in the x-axis,
    // it is okay to have this method fixed
    const { width, height } = this.state
    this.state.x = d3.scaleTime().range([0, width])
    this.state.y = d3.scaleLinear().range([height, 0])
  }
  setupAxis () {
    const { x, y } = this.state
    this.state.xAxis = d3.axisBottom(x)
    this.state.yAxis = d3.axisLeft(y)
  }
  emptyHook (d) {
    // Returns the default value that is provided
    return d
  }

  updateAxis (data) {
    const { x, y, xAxisHook, yAxisHook } = this.state
    const xExtent = d3.extent(data, xAxisHook)

    const yExtent = d3.extent(data, yAxisHook)
    const yRange = yExtent[1] - yExtent[0]
    const yLowerBound = yExtent[0] - 0.05 * yRange
    const yUpperBound = yExtent[1] + 0.05 * yRange
    console.log(yExtent, yLowerBound, yUpperBound)

    x.domain(xExtent)
    y.domain([yLowerBound, yUpperBound])
  }
  fitChart (parentWidth, parentHeight) {
    const { top, right, bottom, left } = this.state
    this.state.width = parentWidth - left - right
    this.state.height = parentHeight - top - bottom
  }
}
