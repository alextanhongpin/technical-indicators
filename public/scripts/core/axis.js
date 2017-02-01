
class Axis extends ChartInterface {
  constructor (props) {
    super(props)
    // Override the inherited props
    this.state.disableXAxis = false
    this.state.disableYAxis = false
  }
  render (svg, data) {
    const {
      left, top, width, height,
      xAxis, yAxis,
      xAxisClassName, yAxisClassName,
      xLabel, yLabel,
      yAxisLineColor, yAxisTickColor, yAxisTextColor, yAxisLabelColor,
      disableXAxis, disableYAxis,
      line, stroke, fill, strokeWidth
    } = this.state

    this.updateAxes(data)

    if (this.context.g) {
      // Remove existing
      this.context.g.remove()
    }

    // Create a new group context
    this.context.g = svg.append('g')
      .attr('transform', `translate(${left}, ${top})`)

    // Axes can be configured to be enabled/disabled anytime
    if (!disableXAxis) {
      // Avoid redrawing it twice
      if (this.context.xAxis) {
        this.context.xAxis.remove()
      }
      this.context.xAxis = this.context.g.append('g')
        .attr('class', xAxisClassName)
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
    }

    if (!disableYAxis) {
      if (this.context.yAxisGroup) {
        this.context.yAxisGroup.remove()
      }
      const yAxisGroup = this.context.g.append('g')
        .attr('class', yAxisClassName)
        .call(yAxis)

      // Add the y-axis primary label text
      yAxisGroup.append('text')
        .attr('fill', yAxisLabelColor)
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text(yLabel)

      // Apply styling for the y-axis vertical line
      yAxisGroup.select('path.domain')
      .attr('stroke', yAxisLineColor)

      // Apply styling for the y-axis label ticks
      yAxisGroup.selectAll('g.tick')
      .selectAll('line')
      .attr('stroke', yAxisTickColor)

      // Apply styling for the y-axis label text
      yAxisGroup.selectAll('g.tick')
      .selectAll('text')
      .attr('stroke', 'none')
      .attr('fill', yAxisTextColor)

      this.context.yAxisGroup = yAxisGroup
    }
  }
}
