/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
import * as d3 from 'd3';
import React from 'react';
import styles from '../styles/world.module.css';
import worldmap from '../data/world.json';
import indicators from '../data/indicators.json';
import countries from '../data/iso_country.json';

export const CHOROPLEITH_WIDTH = 1200;
export const CHOROPLEITH_HEIGHT = 675;
export const colors = ['#00372f', '#0E564C', '#258F81', '#3DCDB9'];

export const useChoropleth = (svgRef, {
  worldData, selectedIndicator, highlights, comparingCountry, iHib,
}) => {
  React.useEffect(() => {
    if (!worldData) return;

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${CHOROPLEITH_WIDTH} ${CHOROPLEITH_HEIGHT}`)
      .attr('class', styles.svg);

    const width = CHOROPLEITH_WIDTH;
    const height = CHOROPLEITH_HEIGHT;

    let world;
    // style of geographic projection and scaling
    const projection = d3.geoNaturalEarth1()
      .scale(250)
      .translate([width / 2, height / 2]);

    // Define color scale
    const colorScale = d3.scaleQuantize()
      .domain([1, Object.keys(worldData).length])
      .range(!iHib ? colors : colors.reverse());

    // add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', styles.tooltip)
      .style('opacity', 0);

    // eslint-disable-next-line no-use-before-define
    render(null, worldmap);

    function render(_, topo) {
      const mouseOver = function (d) {
        d3.selectAll('.Country')
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .style('stroke', 'transparent');
        const hoveredCountry = d3.select(this);

        hoveredCountry.transition()
          .duration(200)
          .style('opacity', 1)
          .style('stroke', 'white')
          .style('stroke-width', 1);

        const tooltipHtml = `
                <b>${countries[hoveredCountry.datum().id] || 'No data'}</b>
                <hr />
                <b>${indicators[selectedIndicator].indicator_name}</b>: ${worldData[hoveredCountry.datum().id]?.[selectedIndicator].value || 'No data'}
                <br />
                <b>POSITION</b>: ${worldData[hoveredCountry.datum().id]?.position || 'No data'}
            `;
        tooltip.style('left', `${d.pageX + 15}px`)
          .style('top', `${d.pageY - 28}px`)
          .style('z-index', '2')
          .style('background', 'white')
          .style('position', 'absolute')
          .html(tooltipHtml)
          .transition()
          .duration(400)
          .style('opacity', 1);

        // (d) => console.log({ hoveredCountry: hoveredCountry.datum() }));
        // .text(`${d.properties.name}: ${Math.round((d.total / 1000000) * 10) / 10} mio.`);
      };

      const mouseLeave = function () {
        d3.selectAll('.Country')
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('stroke', 'black')
          .style('stroke-width', '0.5');
        tooltip.transition().duration(300)
          .style('opacity', 0);
      };
      // Draw the map
      world = svg.append('g')
        .attr('class', 'world');
      world.selectAll('path')
        .data(topo.features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(projection))
        .attr('fill', (d) => {
          if (d.id === 'SDS') {
            // quick workaround
            d.id = 'SSD';
          }
          const data = worldData[d.id];
          if (d.id !== comparingCountry.code && highlights && !highlights.includes(d.id)) return '#808080';
          // console.log(data?.[selectedIndicator])
          if (!data?.[selectedIndicator]) return '#808080';
          return colorScale(data.position);
        })
        // add a class, styling and mouseover/mouseleave and click functions
        .style('stroke', 'black')
        .style('stroke-width', '0.5')
        .attr('class', 'Country')
        .style('opacity', 1)
        .on('mouseover', mouseOver)
        .on('mouseleave', mouseLeave);
    }
    return () => {
      d3.select(svgRef.current).select('svg').remove();
      tooltip.remove();
    };
  }, [worldData, highlights, comparingCountry, iHib]);

  React.useEffect(() => {
    const zoom = d3.zoom().on('zoom', handleZoom);
    function handleZoom(e) {
      d3.select('g.world').attr('transform', e.transform);
    }
    d3.select(svgRef.current).call(zoom);
  }, []);
};
