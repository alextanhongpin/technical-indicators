
class Crosshair extends BaseChart {
  constructor (props) {
    super(props)
  }

  drawChart () {
    // line chart
    const { x, y, xAxisHook, yAxisHook } = this.state
    this.state.line = d3.line()
    .x(d => x(xAxisHook(d)))
    .y(d => y(yAxisHook(d)))
  }

  init () {
    this.setupScale()
    this.setupAxis()
    this.drawChart()
  }

  bindEvents () {
    if (!arguments.length) {
      return target
    }

    if (target) {
      target.on('mousemove.crosshairs', null)
      target.on('mouseout.crosshairs', null)
    }

    target = value

    target.on('mousemove.crosshairs', mousemove)
    target.on('mouseout.crosshairs', mouseout)
  }

  mousemove (state) {
    const { x, y, data = [] } = state
    const self = this
    return function () {
      // Get the X position of the mouse and invert it to get the date
      const mouseX = x.invert(d3.mouse(this)[0])
      let nearest = Infinity

      // let index = null
      data.forEach((d, i) => {
        d.diff = Math.abs(d.date.getTime() - mouseX.getTime())
        nearest = Math.min(nearest, d.diff)
      })
      const index = data.findIndex((d) => {
        return d.diff === nearest
      })
      const closest = data[index]
      // console.log('index', index)
      // const closest = data[index]

      // console.log(index, closest)
      const crosshairX = x(closest.date)
      const crosshairY = y(closest.close)
      self.horizontalLine
      .attr('y1', crosshairY)
      .attr('y2', crosshairY)

      self.verticalLine
      .attr('x1', crosshairX)
      .attr('x2', crosshairX)

      self.circle
      .attr('cx', crosshairX)
      .attr('cy', crosshairY)
    }
  }

  render (svg, data) {
    const { left, top, width, height,
      x, y,
      xAxis, yAxis,
      xAxisClass, yAxisClass,
      xLabel, yLabel,
      yAxisLineColor, yAxisTickColor, yAxisTextColor, yAxisLabelColor,
      disableXAxis, disableYAxis,
      line, stroke, fill, strokeWidth } = this.state
      // Cached the data
    this.state.data = data
    this.updateAxis(data)

    const g = svg.append('g')
      .attr('transform', `translate(${left}, ${top})`)

    // Toggle Crosshairs
    const crosshair = g.append('g')
      .attr('class', 'crosshair')
      // .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    this.circle = crosshair.append('circle')
    .attr('r', 5)
    .attr('stroke', 'grey')
    this.horizontalLine = crosshair.append('line')
      .attr('class', 'crosshair--horizontal')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .attr('stroke', 'grey')
      .attr('stroke-width', 1.5)
      .attr('display', 'block')

    this.verticalLine = crosshair.append('line')
      .attr('class', 'crosshair--vertical')
      .attr('y1', y.range()[0])
      .attr('y2', y.range()[1])
      .attr('stroke', 'grey')
      .attr('stroke-width', 1.5)
      .attr('display', 'block')

    const overlay = g.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      // .attr('transform', 'translate(' + left + ',' + top + ')')
      .on('mousemove', this.mousemove(this.state))
      .on('mouseover', null)
      .on('mouseout', null)
  }
}
