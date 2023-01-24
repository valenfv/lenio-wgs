import * as d3 from 'd3';
import React from 'react';
import styles from '../styles/world.module.css';

export const CHOROPLEITH_WIDTH = 1200;
export const CHOROPLEITH_HEIGHT = 675;

export const useChoropleth = (svgRef) => {

  React.useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = CHOROPLEITH_WIDTH;
    const height = CHOROPLEITH_HEIGHT;

    const path = d3.geoPath();
    const data = new Map();
    const worldmap = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
    const worldpopulation = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv';
    let centered; let
      world;
    // style of geographic projection and scaling
    const projection = d3.geoNaturalEarth1()
      .scale(200)
      .translate([width / 2, height / 2]);
    // Define color scale
    const colorScale = d3.scaleThreshold()
      .domain([1000000, 50000000, 100000000, 500000000])
      .range(['#01012B', '#0E564C', '#0E564C', '#3DCDB9']);
    // add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', styles.tooltip)
      .style('opacity', 0);

    // Load external data and boot
    Promise.allSettled([d3.json(worldmap), d3.csv(worldpopulation, (d) => {
      try {
        data.set(d.code, +d.pop);
      } catch (e) {
      }
    })]).then((status) => {
      render(null, status[0].value);
    });
    // Add clickable background
    svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)
      .on('click', click);

    function render(_, topo) {
      const mouseOver = function (d) {
        d3.selectAll('.Country')
          .transition()
          .duration(200)
          .style('opacity', 0.5)
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
        // draw each country
        // d3.geoPath() is a built-in function of d3 v4 and takes care of showing the map from a properly formatted geojson file, if necessary filtering it through a predefined geographic projection
        .attr('d', d3.geoPath().projection(projection))
        // retrieve the name of the country from data
        .attr('data-name', (d) => d.properties.name)

        // set the color of each country
        .attr('fill', (d) => {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        })
        // add a class, styling and mouseover/mouseleave and click functions
        .style('stroke', 'transparent')
        .attr('class', (d) => 'Country')
        .attr('id', (d) => d.id)
        .style('opacity', 1)
        .on('mouseover', mouseOver)
        .on('mouseleave', mouseLeave)
        .on('click', click);
    }
    function click(d) {
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
  }, []);
}