
class SVGChart {
  constructor ({ el, width = 960, height = 500}) {
    this.state = {
      el,
      width,
      height,
      charts: {},
      svg: d3.select(el).append('svg')
      .attr('width', width)
      .attr('height', height)
    }
    if (!el) {
      throw new Error('SVGError: An parent element is required in order to render the svg element')
    }
  }

  register (name, chart) {
    const { width, height, charts } = this.state
    if (!charts[name]) charts[name] = chart

    // Fit the children chart based on the parent
    // width and height
    // Iterate through all chart
    charts[name].fitChart(width, height)
    charts[name].init()
  }
  unregister (name) {
    const { charts } = this.state
    if (charts[name]) {
      charts[name].destroy()
      charts[name] = null
    }
  }

  render (data) {
    const { svg, charts } = this.state
    Object.values(charts).map((chart) => {
      chart.render(svg, data)
    })
  }
}
