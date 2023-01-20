import { useEffect, useRef } from 'react';
import endpoint_data from "../data/endpoint_data.json";
import { COUNTRIES_QTY, LABELS_MAP, INDICATORS_QTY, INDICATORS_TYPE_MAP } from '../constants/radialChart';
import * as d3 from 'd3';

const RadialChart = () => {
    const radialChart = useRef();

    useEffect(() => {
      const chartLabels = [];
      endpoint_data.metrics.forEach(metric => {
        metric.type = LABELS_MAP[metric.indicator].type
        chartLabels.push(LABELS_MAP[metric.indicator].label)
      });

      endpoint_data.metrics.sort((a, b) => {
        if(a.type < b.type) { return -1; }
        if(a.type > b.type) { return 1; }
        return 0;
      });

      const indicatorsTypeMap = {}

       Object.values(LABELS_MAP).forEach(indicator => indicatorsTypeMap[indicator.label] = indicator.type);

      const width = 900;
      const height = 900;

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

        const eachAngle = (2 * Math.PI) / INDICATORS_QTY;
        const maxOuterRadius = (width / 2);
        const minInnerRadius = (width / 2) * 0.70;

        const min = 1;
        const max = COUNTRIES_QTY;

        const valueScale = d3
          .scaleLinear()
          .domain([min - 6, max])
          .range([minInnerRadius, maxOuterRadius]);

        endpoint_data.metrics.forEach((d, i) => {
          d.startAngle = i * eachAngle;
          d.endAngle = (i + 1) * eachAngle;

          const zeroRadius = valueScale(0);

          if (d.ranking > 0) {
            d.innerRadius = zeroRadius;
            d.outerRadius = valueScale(d.ranking);
          } else {
            d.innerRadius = valueScale(d.ranking);
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
          .data(endpoint_data.metrics)
          .join('path')
          .attr('class', 'radial-bar')
          .attr('d', (d) => {
            return arc(d);
          })
          .attr('fill', d => INDICATORS_TYPE_MAP[LABELS_MAP[d.indicator].type]);

        // circles
        center
          .selectAll('.radial-circle')
          .data([1, 174])
          .join('circle')
          .attr('r', (d) => valueScale(d))
          .attr('fill', 'none')
          .attr('stroke', '#EEEEEE')
          .attr('opacity', 0.2)

        const g = center
          .selectAll('.radial-axis-g')
          .data(chartLabels)
          .join('g')
          .attr('font-family', 'Montserrat')
          .attr('transform', (d, i) => {
            const angle = (360 / INDICATORS_QTY) * i - 90;
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

          const categories = [];

          chartLabels.forEach(label => {
            categories.push({
              label,
              value: 1
            })
          })

          const piewidth = 638;
          const pieHeight = 650;
          const radius = piewidth / 2;

          const formattedData = d3.pie().value(d => d.value)(categories);
          const arcGenerator = d3.arc().innerRadius(300).outerRadius(radius);

          const pie = svg.append('g');

          const textWrap = (label: string) => {
            let indicator = label
            if (label.length > 4) {
              indicator = `${label.split('').splice(0, 4).join('')}...`;
            }
            return indicator;
          };

          pie.selectAll()
            .data(formattedData)
            .join('path')
              .attr('d', arcGenerator)
              .attr('id', d => d.data.label
              )
              .attr('fill', d => INDICATORS_TYPE_MAP[indicatorsTypeMap[d.data.label]])
              .attr('class', 'center')
              .attr('transform', `translate(${width / 2},${height / 2})`);

          categories.forEach((category, index) => {
            const text = svg.append("text")
              .attr("x", index > 8 && index < 27 ? 90 : 18)
              .attr("dy", 13)

            text.append("textPath")
              .attr("fill","#01012B")
              .attr('font-family', 'Monstserrat')
              .style('text-anchor', 'start')
              .attr('font-weight', 700)
              .attr('font-size', '12px')
              .attr('overflow', 'ellipsis')
              .attr("xlink:href", `#${category.label}`)
              .text(textWrap(category.label));
          })
  }, []);


    return (
        <div id='radialChartContainer'>
            <svg ref={radialChart}></svg>
        </div>
    );
};

export default RadialChart;