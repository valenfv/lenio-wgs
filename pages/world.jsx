import React from 'react';
import * as d3 from 'd3';
import styles from '../styles/world.module.css';

const readyWithParams = (tooltip, world, projection, colorScale, data, height, svg, click) => function ready(error, topo, ...rest) {
  // topo is the data received from the d3.queue function (the world.geojson)
  // the data from world_population.csv (country code and country population) is saved in data variable
  console.log({
    called: true, topo, error, ...rest,
  });
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
    console.log({ d });
    tooltip.style('left', `${d.pageX + 15}px`)
      .style('top', `${d.pageY - 28}px`)
      .style('z-index', '2')
      .style('background', 'white')
      .style('position', 'absolute')
      .transition()
      .duration(400)
      .style('opacity', 1)
      .text('hello');
    console.log({ dataName: this.attributes });
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
    .on('mouseleave', mouseLeave);
  // .on('click', click);

  // Legend
  // const x = d3.scaleLinear()
  //   .domain([2.6, 75.1])
  //   .rangeRound([600, 860]);

  // const legend = svg.append('g')
  //   .attr('id', 'legend');

  // const legend_entry = legend.selectAll('g.legend')
  //   .data(colorScale.range().map((d) => {
  //     d = colorScale.invertExtent(d);
  //     if (d[0] == null) d[0] = x.domain()[0];
  //     if (d[1] == null) d[1] = x.domain()[1];
  //     return d;
  //   }))
  //   .enter().append('g')
  //   .attr('class', 'legend_entry');

  // const ls_w = 20;
  // const ls_h = 20;

  // legend_entry.append('rect')
  //   .attr('x', 20)
  //   .attr('y', (d, i) => height - (i * ls_h) - 2 * ls_h)
  //   .attr('width', ls_w)
  //   .attr('height', ls_h)
  //   .style('fill', (d) => colorScale(d[0]))
  //   .style('opacity', 0.8);

  // legend_entry.append('text')
  //   .attr('x', 50)
  //   .attr('y', (d, i) => height - (i * ls_h) - ls_h - 6)
  //   .text((d, i) => {
  //     if (i === 0) return `< ${d[1] / 1000000} m`;
  //     if (d[1] < d[0]) return `${d[0] / 1000000} m +`;
  //     return `${d[0] / 1000000} m - ${d[1] / 1000000} m`;
  //   });

  // legend.append('text').attr('x', 15).attr('y', 280).text('Population (Million)');
};

// Zoom functionality
const clickWithParams = (centered, path, world) => function click(d) {
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

function loadMap(svgRef) {
  // initial setup
  const svg = d3.select(svgRef.current);
  const width = svg.attr('width');
  const height = svg.attr('height');
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
      console.log(e);
    }
  })]).then((status) => {
    readyWithParams(tooltip, world, projection, colorScale, data, height, svg, clickWithParams(centered, path, world, d3))(null, status[0].value);
  });
  // Add clickable background
  svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .on('click', clickWithParams(centered, path, world, d3));
}

export default function World() {
  const svgRef = React.useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    loadMap(svgRef);
  }, []);

  return (
    <div className={styles.worldContainer}>
      <div className={styles.floatingMenu}>
        hello
      </div>
      <div className={styles.map}>
        <svg className={styles.svg} ref={svgRef} width="1200" height="675" />
      </div>
    </div>
  );
}
