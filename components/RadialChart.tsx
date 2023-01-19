import { useEffect, useRef } from 'react';
import data from "../data/data.json";
import * as d3 from 'd3';

const RadialChart = () => {
    const radialChart = useRef();

    useEffect(() => {
      const width = 600;
      const height = 620;

      //chart container
      const svg = d3.select(radialChart.current)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'transparent');

      const center = svg
        .selectAll('.center')
        .data([1])
        .join('g')
        .attr('class', 'center')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const eachAngle = (2 * Math.PI) / data.length;
      const maxOuterRadius = (width / 2);
      const minInnerRadius = (width / 2) * 0.70;

      const extent = d3.extent(data, (d) => d.temp);
      const min = extent[0];
      const max = extent[1];

      const valueScale = d3
      .scaleLinear()
      .domain([extent[0] - 5, extent[1]])
      .range([minInnerRadius, maxOuterRadius]);

    const colorScale = d3
      .scaleLinear()
      .domain([min, max])
      .range(['#45F9E0', '#45F9E040']);

    data.forEach((d, i) => {
      d.startAngle = i * eachAngle;
      d.endAngle = (i + 1) * eachAngle;

      const zeroRadius = valueScale(0);

      if (d.temp > 0) {
        d.innerRadius = zeroRadius;
        d.outerRadius = valueScale(d.temp);
      } else {
        d.innerRadius = valueScale(d.temp);
        d.outerRadius = zeroRadius;
      }
    });

    const arc = d3
      .arc()
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle);

    // bars
    center
      .selectAll('.radial-bar')
      .data(data)
      .join('path')
      .attr('class', 'radial-bar')
      .attr('d', (d) => {
        return arc(d);
      })
      .attr('fill', (d) => colorScale(d.temp))
      // .attr('stroke', (d) => colorScale(d.temp));
    //   .attr('fill', '#45F9E040')
    // //   .attr('stroke', '#45F9E040');

    /** Axis */

    const scaleTicks = valueScale.ticks(5);

    // circles
    center
      .selectAll('.radial-circle')
      .data(scaleTicks)
      .join('circle')
      .attr('r', (d) => valueScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#EEEEEE')
      .attr('opacity', 0.2)

    // text showing circle limit
    center
      .selectAll('.radial-text')
      .data(scaleTicks)
      .join('text')
      .text((d) => d >= 0 ? d : null)
      .attr('y', (d) => -valueScale(d))
      .attr('fill', '#EEEEEE40')
      .attr('font-family', 'arial')
      .attr('font-size', '10px')
      .attr('font-weight', 400)
      .clone(true)

    const months = [
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
    ];

    // categories text properties
    const g = center
      .selectAll('.radial-axis-g')
      .data(months)
      .join('g')
      .attr('fill', '#01012B')
      .attr('font-weight', 500)
      .style('z-index', 10)
      .attr('font-size', '10px')
      .attr('font-family', 'Montserrat')
      .attr('transform', (d, i) => {
        const angle = (360 / months.length) * i - 90;
        return `rotate(${angle})`;
      })

    // lines between categories
    g.append('line')
      .attr('x1', minInnerRadius)
      .attr('y1', 0)
      .attr('x2', maxOuterRadius)
      .attr('y2', 0)
      .attr('stroke', '#EEEEEE')
      .attr('opacity', 0.2);

    // categories text
    g.append('text')
      .text((d) => d)
      .attr('transform', (d, i) => {
        let x = minInnerRadius - 20;
        let y = 40
        let rotation = 102;
        x = x + 20;
        if (i > 2 && i < 9) {
          rotation = -80;
          x = x + 2;
          y = 55
        }
        return `translate(${x},${y}) rotate(${rotation})`;
      });

      const categories = [
        {property: 'Aug', value: 1},
        {property: 'Sep', value: 1},
        {property: 'Oct', value: 1},
        {property: 'Nov', value: 1},
        {property: 'Dec', value: 1},
        {property: 'Jan', value: 1},
        {property: 'Feb', value: 1},
        {property: 'Mar', value: 1},
        {property: 'Apr', value: 1},
        {property: 'May', value: 1},
        {property: 'Jun', value: 1},
        {property: 'Jul', value: 1},
      ];

      const pieColors = ['#5A7EDA', '#5A7EDA', '#5A7EDA', '#ED762F', '#ED762F', '#ED762F', '#DCB300', '#DCB300', '#DCB300', '#55BDA6', '#55BDA6', '#55BDA6'];

      const rotateText = (i) => {
        let x = minInnerRadius - 20;
        let y = 40
        let rotation = 102;
        x = x + 20;
        if (i > 2 && i < 9) {
          rotation = -80;
          x = x + 2;
          y = 55
        }
        return `translate(${x},${y}) rotate(${rotation})`;
      }

      const piewidth = 455;
      const pieHeight = 455;
      const radius = piewidth / 2;

      const formattedData = d3.pie().value(d => d.value)(categories);
      const arcGenerator = d3.arc().innerRadius(210).outerRadius(radius);

      const pie = svg.append('g');

      pie.selectAll()
        .data(formattedData)
        .join('path')
          .attr('d', arcGenerator)
          .attr('id', d => d.data.property)
          .attr('fill', d => pieColors[d.index])
          .attr('class', 'center')
          .attr('transform', `translate(${width / 2},${height / 2})`);

      categories.forEach((category, index) => {
        const text = svg.append("text")
          .attr("x", index < 9 && index > 2 ? 180 : 50)
          .attr("dy", 13)

        text.append("textPath")
          .attr("fill","#01012B")
          .attr('font-family', 'Monstserrat')
          .style('text-anchor', 'start')
          .attr('font-weight', 700)
          .attr('font-size', '12px')
          .attr("xlink:href", `#${category.property}`)
          .text(category.property);
      })
  }, []);


    return (
        <div id='radialChartContainer'>
            <svg ref={radialChart}></svg>
        </div>
    );
};

export default RadialChart;