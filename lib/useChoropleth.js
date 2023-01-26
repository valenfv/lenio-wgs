import * as d3 from 'd3';
import React from 'react';
import styles from '../styles/world.module.css';
import worldmap from '../data/world.json'
import indicators from '../data/indicators.json';

export const CHOROPLEITH_WIDTH = 1200;
export const CHOROPLEITH_HEIGHT = 675;

export const useChoropleth = (svgRef, { worldData, selectedIndicator }) => {

  React.useEffect(() => {
    if (!worldData) return;

    const plainValues = Object.keys(worldData).map(country => worldData[country][selectedIndicator]);
    const {
      indicatorMax,
      indicatorMin
    } = {
      indicatorMax: Math.max.apply(Math, plainValues),
      indicatorMin: Math.min.apply(Math, plainValues)
    }

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${CHOROPLEITH_WIDTH} ${CHOROPLEITH_HEIGHT}`)
      .attr('class', styles.svg);

    const width = CHOROPLEITH_WIDTH;
    const height = CHOROPLEITH_HEIGHT;

    const path = d3.geoPath();

    let centered; let
      world;
    // style of geographic projection and scaling
    const projection = d3.geoNaturalEarth1()
      .scale(200)
      .translate([width / 2, height / 2]);
    // Define color scale
    const colorScale = d3.scaleQuantize()
      .domain([indicatorMin, indicatorMax])
      .range(['#00231E', '#0E564C', '#258F81', '#3DCDB9']);
    // add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', styles.tooltip)
      .style('opacity', 0);

    // Add clickable background
    svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)
      .on('click', click);

    render(null, worldmap);



    function render(_, topo) {
      const mouseOver = function (d) {
        console.log({ hover: true, })
        d3.selectAll('.Country')
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .style('stroke', 'transparent');
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('stroke', 'black');
        tooltip.style('left', `${d.pageX + 15}px`)
          .style('top', `${d.pageY - 28}px`)
          .style('z-index', '2')
          .style('background', 'white')
          .style('position', 'absolute')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .text('hello');
        // .text(`${d.properties.name}: ${Math.round((d.total / 1000000) * 10) / 10} mio.`);
      };

      const mouseLeave = function () {
        d3.selectAll('.Country')
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('stroke', 'transparent');
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
          const data = worldData[d.id];
          if (!data) return 'grey';
          return colorScale(data[selectedIndicator]);
        })
        // add a class, styling and mouseover/mouseleave and click functions
        .style('stroke', 'black')
        .style('stroke-width', '0.2')
        .attr('class', 'Country')
        .style('opacity', 1)
        .on('mouseover', mouseOver)
        .on('mouseleave', mouseLeave)
        .on('click', click);
    }
    function click(d) {
      console.log('click')
      d = d3.select(this).data()[0];
      let x; let y; let
        k;
      if (d && centered !== d) {
        const centroid = path.centroid(d);
        x = -(centroid[0] * 6);
        y = (centroid[1] * 6);
        k = 3;
        centered = d;
      } else {
        x = 0;
        y = 0;
        k = 1;
        centered = null;
      }
      world.selectAll('path')
        .classed('active', centered && ((d) => d === centered));
      world.transition()
        .duration(750)
        .attr('transform', `translate(${x},${y}) scale(${k})`);
    };
    return () => {
      d3.select(svgRef.current).select('svg').remove();
    }
  }, [worldData, selectedIndicator]);
}