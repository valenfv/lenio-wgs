/* eslint-disable consistent-return */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-use-before-define */
import React from 'react';
import * as d3 from 'd3';
import { abbreviateNumber } from 'js-abbreviation-number';
import styles from '../styles/commons.module.css';
import countries from '../data/iso_country.json';

export const SCATTERPLOT_WIDTH = 800;
export const SCATTERPLOT_HEIGHT = 500;

/*
            {
                comparing: 'CHL',
                indicatorX: {
                    id,
                    indicator_name,
                    min,
                    max,
                },
                indicatorY: {
                    id,
                    indicator_name,
                    min,
                    max,
                },
                hightlights: [
                    "ARG",
                    "CHL",
                ]
                data: [{
                    isoCc: 'ARG',
                    name: 'Argentina',
                    HDI_INDEX: 24.5,
                    GINI_INDEX: 3,
                    neighboring: [
                        "CHL",
                        "PRY",
                        "URY",
                        "BOL",
                    ],
                    organizations: [
                        "ORG 1",
                        "ORG 2",
                        "ORG 3",
                    ]
                }]
            }
        */

export const useScatterPlot = ({
  svgRef, data, highlights, indicatorX, indicatorY, comparingCountry,
}) => {
  React.useEffect(() => {
    if (!data || !comparingCountry) return;

    const onMouseEnter = function (d) {
      const element = d3.select(this);
      const datum = element.datum();
      if (!datum) return;
      if (datum.isoCc === comparingCountry.code) {
        element
          .transition()
          .duration(200)
          .style('fill', '#386e62');
      } else {
        //
        element
          .transition()
          .duration(200)
          .attr('stroke', '#ED762F');
      }
      const tooltipHtml = `
                <b>${countries[datum.isoCc]}</b>
                <hr />
                <b>${indicatorX.indicator_name}: </b>${datum[indicatorX.id].value}
                <br />
                <b>${indicatorY.indicator_name}: </b>${datum[indicatorY.id].value}
            `;
      tooltip
        .style('left', `${d.layerX + 15}px`)
        .style('top', `${d.layerY - 28}px`)
        .html(tooltipHtml)
        .transition()
        .duration(400)
        .style('opacity', 1);
    };

    const onMouseLeave = function () {
      const element = d3.select(this);
      if (!element.datum()) return;
      if (element.datum().isoCc === comparingCountry.code
        || highlights?.includes(element.datum().isoCc)
        || !highlights) {
        element
          .transition()
          .duration(200)
          .style('fill', '#69b3a2')
          .attr('stroke', 'transparent');
      } else {
        //
        element
          .transition()
          .duration(200)
          .attr('stroke', 'white');
      }
      tooltip.transition().duration(300).style('opacity', 0);
    };

    // set the dimensions and margins of the graph
    const margin = {
      top: 20, right: 90, bottom: 60, left: 30,
    };
    const width = SCATTERPLOT_WIDTH - margin.left - margin.right;
    const height = SCATTERPLOT_HEIGHT - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left},${margin.top})`,
      );

    var zoom = d3.zoom()
      .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on('zoom', updateChart);

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      // .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(zoom);

    // tooltip
    var tooltip = d3.select(svgRef.current)
      .append('div')
      .attr('class', styles.dataTooltip)
      .style('opacity', 0);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([indicatorX.min * 0.95, indicatorX.max * 1.05])
      .range([0, width]);
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .style('color', 'hsla(0, 0%, 93%, 0.7)')
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([indicatorY.min * 0.95, indicatorY.max * 1.05])
      .range([height, 0]);
    const yAxis = svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .style('color', 'hsla(0, 0%, 93%, 0.7)')
      .call(d3.axisRight(y).ticks(10).tickFormat((val) => abbreviateNumber(val, 2, ['', 'k', 'M', 'B', 'T'])));

    // labels

    svg.append('text')
      .attr('class', `${styles.axis} ${styles.svgText}`)
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .text(indicatorX.indicator_name);

    svg.append('text')
      .attr('class', `${styles.axis} ${styles.svgText}`)
      .attr('x', -height / 2)
      .attr('y', width + 60)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(indicatorY.indicator_name);

    // Add dots
    const cloud = svg.append('g');

    cloud.selectAll('dot')
      .data(data)
      .enter()
      .filter((d) => d.isoCc !== comparingCountry.code)
      .append('circle')
      .attr('cx', (d) => x(d[indicatorX.id].value))
      .attr('cy', (d) => y(d[indicatorY.id].value))
      .attr('r', 5)
      .style('fill', '#69b3a2')
      .on('mouseover', onMouseEnter)
      .on('mouseleave', onMouseLeave);

    const comparingCountryData = data.find((c) => c.isoCc === comparingCountry.code);
    if (comparingCountryData) {
      cloud
        .datum(comparingCountryData)
        .append('rect')
        .attr('class', 'comparing-country')
        .attr('width', 16)
        .attr('height', 16)
        .attr('x', x(comparingCountryData?.[indicatorX.id].value) - 8)
        .attr('y', y(comparingCountryData?.[indicatorY.id].value) - 8)
        .attr('country-isocc', comparingCountry)
        .style('fill', '#69b3a2')
        // .attr('stroke', '#ED762F')
        .style('transform', 'rotate(45deg)')
        .style('transform-origin', `${x(comparingCountryData?.[indicatorX.id].value) - 16}px ${y(comparingCountryData?.[indicatorY.id].value)}px`)
        .on('mouseover', onMouseEnter)
        .on('mouseleave', onMouseLeave);
    }

    // zooming

    function updateChart(e) {
      // recover the new scale
      var newX = e.transform.rescaleX(x);
      var newY = e.transform.rescaleY(y);

      // // update axes with these new boundaries
      xAxis.call(d3.axisBottom(newX));
      yAxis.call(d3.axisLeft(newY))
        .selectAll('.tick text')
        .attr('x', 9);
      yAxis.selectAll('.tick line')
        .attr('x2', 6);

      // // update circle position
      d3.select(svgRef.current)
        .selectAll('circle')
        .attr('cx', (d) => newX(d[indicatorX.id].value))
        .attr('cy', (d) => newY(d[indicatorY.id].value));

      d3.select(svgRef.current)
        .select('.comparing-country')
        .attr('x', newX(comparingCountryData?.[indicatorX.id].value) - 8)
        .attr('y', newY(comparingCountryData?.[indicatorY.id].value) - 8)
        .style('transform-origin', `${newX(comparingCountryData?.[indicatorX.id].value) - 16}px ${newY(comparingCountryData?.[indicatorY.id].value)}px`);
    }

    return () => {
      d3.select(svgRef.current).select('svg').remove();
    };
  }, [svgRef, data, indicatorX, indicatorY, comparingCountry, highlights]);

  React.useEffect(() => {
    if (!data) return;
    if (highlights) {
      // highlight countries in the list and change the opacity to others
      d3.select(svgRef.current)
        .selectAll('circle')
        .filter((country) => !highlights.includes(country.isoCc))
        .transition()
        .duration(500)
        .style('opacity', '0.3')
        .style('fill', 'black')
        .attr('stroke', 'white')
        .attr('r', '5');
      d3.select(svgRef.current)
        .selectAll('circle')
        .filter((country) => highlights.includes(country.isoCc))
        .transition()
        .duration(500)
        .style('fill', '#69b3a2')
        .style('opacity', '1')
        .attr('stroke', 'none');
      return () => {
        d3.select(svgRef.current)
          .selectAll('circle')
          .filter((country) => !highlights.includes(country.isoCc))
          .transition()
          .duration(500)
          .style('opacity', '1');
      };
    }
  }, [data, highlights, svgRef, comparingCountry]);
};
