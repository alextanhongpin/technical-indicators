
class LineChart extends BaseChart {
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
  destroy () {
    this.g.remove()
  }

  render (svg, data) {
    const { left, top, width, height,
      xAxis, yAxis,
      xLabel, yLabel,
      disableXAxis, disableYAxis,
      color, line, stroke, fill, strokeWidth } = this.state

    this.updateAxis(data)
    if (this.g) {
      this.g.remove()
    }

    this.g = svg.append('g')
      .attr('transform', `translate(${left}, ${top})`)

    if (!disableXAxis) {
      this.g.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .select('.domain')
        .remove()
    }
    if (!disableYAxis) {
      this.g.append('g')
        .call(yAxis)
        .append('text')
        .attr('fill', color)
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text(yLabel)
    }

    this.g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', strokeWidth)
      .attr('d', line)
  }
}
