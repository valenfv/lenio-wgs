import { useEffect, useRef } from 'react';
import data from "../data/data.json";
import * as d3 from 'd3';

const RadialChart = () => {
    const radialChart = useRef();

    useEffect(() => {
      const width = 600;
      const height = 600;

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
      const minInnerRadius = (width / 2) * 0.6;

      const extent = d3.extent(data, (d) => d.temp);
      const min = extent[0];
      const max = extent[1];

      const valueScale = d3
      .scaleLinear()
      .domain(extent)
      .range([minInnerRadius, maxOuterRadius]);

    const colorScale = d3
      .scaleLinear()
    //   .domain([min, 0, 0, max])
    // //   .range(['darkblue', 'skyblue', 'orange', 'darkred']);

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

    center
      .selectAll('.radial-bar')
      .data(data)
      .join('path')
      .attr('class', 'radial-bar')
      .attr('d', (d) => {
        return arc(d);
      })
      .attr('fill', '#45F9E040')
    //   .attr('stroke', '#45F9E040');

    /** Axis */

    const scaleTicks = valueScale.ticks(5);

    center
      .selectAll('.radial-circle')
      .data(scaleTicks)
      .join('circle')
      .attr('r', (d) => valueScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#EEEEEE')
      .attr('opacity', 0.2);

    // center
    //   .selectAll('.radial-text')
    //   .data(scaleTicks)
    //   .join('text')
    //   .text((d) => d)
    //   .attr('y', (d) => -valueScale(d))
    //   .attr('stroke-width', 5)
    //   .attr('stroke', 'white')
    //   .clone(true)
    //   .attr('stroke', 'none');

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

    const g = center
      .selectAll('.radial-axis-g')
      .data(months)
      .join('g')
      .attr('color', '#AAAAAA')
      .attr('fill', '#AAAAAA')
      .attr('font-weight', 500)
      .attr('font-size', '10px')
      .attr('font-family', 'Montserrat')
      .attr('transform', (d, i) => {
        const angle = (360 / months.length) * i - 90;
        return `rotate(${angle})`;
      });

    g.append('line')
      .attr('x1', minInnerRadius)
      .attr('y1', 0)
      .attr('x2', maxOuterRadius)
      .attr('y2', 0)
      .attr('stroke', '#EEEEEE')
      .attr('opacity', 0.2);

    g.append('text')
      .text((d) => d)
      .attr('transform', (d, i) => {
        let x = minInnerRadius - 20;
        let rotation = 0;
        if (i > 6 && i < 12) {
          rotation = 180;
          x = x + 15;
        }
        return `translate(${x},0) rotate(${rotation})`;
      });

  }, []);


    return (
        <div id='radialChartContainer'>
            <svg ref={radialChart}></svg>
        </div>
    );
};

export default RadialChart;