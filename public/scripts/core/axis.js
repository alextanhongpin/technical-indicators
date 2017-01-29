
class Axis extends BaseChart {
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

  render (svg, data) {
    const { left, top, width, height,
      xAxis, yAxis,
      xAxisClass, yAxisClass,
      xLabel, yLabel,
      yAxisLineColor, yAxisTickColor, yAxisTextColor, yAxisLabelColor,
      disableXAxis, disableYAxis,
      line, stroke, fill, strokeWidth } = this.state

    this.updateAxis(data)
    if (this.g) {
      // Remove existing
      this.g.remove()
    }
    this.g = svg.append('g')
      .attr('transform', `translate(${left}, ${top})`)

    if (!disableXAxis) {
      this.g.append('g')
        .attr('class', xAxisClass)
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
    }
    if (!disableYAxis) {
      if (this.yAxisGroup) {
        this.yAxisGroup.remove()
      }
      this.yAxisGroup = this.g.append('g')
        .attr('class', yAxisClass)
        .call(yAxis)

      this.yAxisGroup.append('text')
        .attr('fill', yAxisLabelColor)
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text(yLabel)

      this.yAxisGroup.select('path.domain')
      .attr('stroke', yAxisLineColor)

      this.yAxisGroup.selectAll('g.tick')
      .selectAll('line')
      .attr('stroke', yAxisTickColor)

      this.yAxisGroup.selectAll('g.tick')
      .selectAll('text')
      .attr('stroke', 'none')
      .attr('fill', yAxisTextColor)
    }
  }
}
