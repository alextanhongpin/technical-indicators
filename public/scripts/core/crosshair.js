
class Crosshair extends ChartInterface {
  constructor (props) {
    super(props)

    const assignedProperties = {
      crosshairClassName: props.crosshairClassName,
      // Horizontal
      horizontalLineClassName: props.horizontalLineClassName,
      horizontalLineStroke: props.horizontalLineStroke,
      horizontalLineStrokeWidth: props.horizontalLineStrokeWidth,
      // Vertical
      verticalLineClassName: props.verticalLineClassName,
      verticalLineStroke: props.verticalLineStroke,
      verticalLineStrokeWidth: props.verticalLineStrokeWidth,
      // Circle
      circleClassName: props.circleClassName,
      circleFill: props.circleFill
    }
    // Remove undefined values
    const copy = Object.keys(assignedProperties).reduce((newObject, key) => {
      if (assignedProperties[key]) {
        newObject[key] = assignedProperties[key]
      }
      return newObject
    }, {})

    const defaults = {
      crosshairClassName: 'crosshair',
      // Horizontal
      horizontalLineClassName: 'crosshair--horizontal',
      horizontalLineStroke: '#333',
      horizontalLineStrokeWidth: 1.5,
      // Vertical
      verticalLineClassName: 'crosshair--vertical',
      verticalLineStroke: '#333',
      verticalLineStrokeWidth: 1.5,
      // Circle
      circleClassName: 'crosshair--circle',
      circleFill: '#333'
    }

    this.state = Object.assign({}, this.state, defaults, copy)
  }

  mouseleave () {
    this.context.horizontalLine
    .attr('display', 'none')

    this.context.verticalLine
    .attr('display', 'none')

    this.context.circle
    .attr('display', 'none')
  }

  mousemove (state, context) {
    const { x, y, data = [] } = state
    const { horizontalLine, verticalLine, circle } = context
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

      const crosshairX = x(closest.date)
      const crosshairY = y(closest.close)

      horizontalLine
      .transition()
      .duration(50)
      .attr('display', 'block')
      .attr('y1', crosshairY)
      .attr('y2', crosshairY)

      verticalLine
      .transition()
      .duration(50)
      .attr('display', 'block')
      .attr('x1', crosshairX)
      .attr('x2', crosshairX)

      circle
      .transition()
      .duration(50)
      .attr('display', 'block')
      .attr('cx', crosshairX)
      .attr('cy', crosshairY)
    }
  }

  render (svg, data) {
    const {
      left, top, width, height,
      x, y,
      xAxis, yAxis,
      circleClassName, circleFill,
      horizontalLineClassName, horizontalLineStroke, horizontalLineStrokeWidth,
      verticalLineClassName, verticalLineStroke, verticalLineStrokeWidth,
      line, stroke, fill, strokeWidth
    } = this.state
      // Cached the data
    this.state.data = data
    this.updateAxes(data)

    // Avoid drawing twice
    if (this.context.g) {
      this.context.g.remove()
      this.context.g = null
    }

    this.context.g = svg.append('g')
      .attr('transform', `translate(${left}, ${top})`)

    if (this.context.crosshair) {
      this.context.crosshair.remove()
      this.context.crosshair = null
    }
    // Toggle Crosshairs
    this.context.crosshair = this.context.g.append('g')
      .attr('class', 'crosshair')
      .call(xAxis)

    this.context.circle = this.context.crosshair.append('circle')
      .attr('r', 5)
      .attr('class', circleClassName)
      .attr('fill', circleFill)

    this.context.horizontalLine = this.context.crosshair.append('line')
      .attr('class', horizontalLineClassName)
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .attr('stroke', horizontalLineStroke)
      .attr('stroke-width', horizontalLineStrokeWidth)
      .attr('stroke-dasharray', '1, 2')
      .attr('display', 'none')

    this.context.verticalLine = this.context.crosshair.append('line')
      .attr('class', verticalLineClassName)
      .attr('y1', y.range()[0])
      .attr('y2', y.range()[1])
      .attr('stroke', verticalLineStroke)
      .attr('stroke-width', verticalLineStrokeWidth)
      .attr('stroke-dasharray', '1, 2')
      .attr('display', 'none')

    // Create an overlay on top of the chart
    // The overlay will be the one listening to the mouse events
    this.context.overlay = this.context.g.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      // .attr('transform', 'translate(' + left + ',' + top + ')')
      .on('mousemove', this.mousemove(this.state, this.context))
      .on('mouseover', null)
      .on('mouseleave', this.mouseleave.bind(this))
  }
}
