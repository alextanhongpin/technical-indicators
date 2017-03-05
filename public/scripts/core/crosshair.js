
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
    const { x, y, data = [], height } = state
    const { horizontalLine, verticalLine, circle, yAnnotation, xAnnotation } = context
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

      yAnnotation
      .transition()
      .duration(50)
      .attr('transform', `translate(0, ${crosshairY})`)
      .select('text').text(closest.close)

      xAnnotation
      .transition()
      .duration(50)
      .attr('transform', `translate(${crosshairX}, ${height})`)
      .select('text').text(closest.date)
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

      // For displaying y-annotations
    this.context.yAnnotation = this.drawAnnotationY(this.context.crosshair)
    this.context.xAnnotation = drawAnnotationX(this.context.crosshair, {
      height: height
    })

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

    // this.context.crosshair.append('rect')
    // .attr('width', 30)
    // .attr('height', 40)
    // .attr('fill', 'blue')
    // .data([{ x: 0, y: 0 }])
    // .attr('transform', 'translate(0, 0)')
    // .call(dragBehaviour)
  }
  drawAnnotationY (root, data) {
    const annotationY = root.append('g')
    .attr('transform', `translate(0, 120)`)

    annotationY.append('rect')
    .attr('width', 30)
    .attr('height', 20)
    .attr('stroke', 'black')

    annotationY.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '12px')
    .attr('fill', 'red')
    .text('Hello')

    return annotationY
  }

}

// Function as modules
function drawAnnotationX (root, data) {
  const x = root.append('g')
  .attr('transform', `translate(0, ${data.height})`)

  x.append('rect')
  .attr('width', 30)
  .attr('height', 20)
  .attr('stroke', 'black')

  x.append('text')
  .attr('font-family', 'sans-serif')
  .attr('font-size', '12px')
  .attr('fill', 'red')
  .text('Hello')

  return x
}

function horizontalLine (root, data) {
  return root.append('line')
  .attr('class', data.class)
  .attr('x1', data.x1)
  .attr('x2', data.x2)
  .attr('stroke', data.stroke)
  .attr('stroke-width', data.strokeWidth)
  .attr('stroke-dasharray', '1, 2')
  .attr('display', 'none')
}

function dragBehaviour () {
  return d3.drag()
  .subject(function () {
    const evt = d3.select(this)
    return {
      x: 0,
      y: 120
    }
  })
  // .on('start', function () {
  //   d3.event.sourceEvent.stopPropagation() // silence other listeners
  //   if (d3.event.sourceEvent.which == 1) {
  //        // dragInitiated = true;
  //   }
  // })
  .on('drag', function (d, i) {
    console.log('dragging')
    d.x += d3.event.dx
    d.y += d3.event.dy
    d3.select(this).attr('transform', function (d, i) {
      return `translate([${d3.event.x}, ${d3.event.y}])`
    })
  })
}
