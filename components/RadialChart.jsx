/* eslint-disable no-inner-declarations */
/* eslint-disable prefer-spread */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getCountryISO2 from 'country-iso-3-to-2';
import * as d3 from 'd3';
import { abbreviateNumber } from 'js-abbreviation-number';
import { fetchRankingData } from '../slices/radialChartSlice';
import { changeSelectedIndicator } from '../slices/sidebarSlice';
import {
  COUNTRIES_QTY,
  LABELS_MAP,
  INDICATORS_QTY,
  INDICATORS_TYPE_MAP,
} from '../constants/radialChart';
import {
  capitalizeFirstLetter,
  setEllipsis,
  getRadialChartLabes,
  getIndicatorsTypemap,
  getCountries,
} from '../lib/helpers';
import styles from '../styles/world.module.css';
import countries from '../data/iso_country.json';
import {
  COUNTRY, NEIGHBORS, WORLD, ORGANIZATION,
} from './CountryPicker';
import organizations from '../data/organizations.json';
import bordering from '../data/bordering_countries.json';
import radialStyles from '../styles/radial.module.css';
import indicators from '../data/indicators.json';

function usePrevious(state) {
  const ref = React.useRef(state || null);

  React.useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref.current;
}

function RadialChart() {
  const radialChart = useRef();
  const dispatch = useDispatch();
  const {
    comparingCountry, selectedCountry, selectedIndicator, metrics,
  } = useSelector((state) => ({
    comparingCountry: state.sidebar.comparingCountry,
    selectedCountry: state.sidebar.selectedCountry,
    selectedIndicator: state.sidebar.selectedIndicator,
    metrics: state.radialChart.metrics,
  }));

  const previousSelectedIndicator = usePrevious(selectedIndicator);

  const width = 750;
  const height = 750;
  const eachAngle = (2 * Math.PI) / INDICATORS_QTY;
  const maxOuterRadius = width / 2;
  const minInnerRadius = (width / 2) * 0.7;

  const valueScale = d3
    .scaleLinear()
    .domain([-6, 175])
    .range([minInnerRadius, maxOuterRadius]);

  // Bar Chart functions
  const getBarColor = (data, country) => {
    if (country === comparingCountry?.code) {
      return '#59C3C3CC';
    }
    return '#59C3C340';
  };

  const getBarXPosition = () => 115;

  const getTooltipData = (indicator, metrics) => {
    const country = metrics.filter((ind) => ind.indicator === indicator)[0];
    const imgSrc = `https://flagcdn.com/w20/${String(
      getCountryISO2(comparingCountry?.code),
    ).toLowerCase()}.png`;
    const imgSrcSet = `https://flagcdn.com/w40/${String(
      getCountryISO2(comparingCountry?.code),
    ).toLowerCase()}.png 2x`;
    return {
      ranking: country.ranking,
      value: country.sortedCountries?.filter(
        (item) => item.country === comparingCountry?.code,
      )[0]?.value,
      imgSrc,
      imgSrcSet,
    };
  };

  const highlights = React.useMemo(() => {
    if (selectedCountry?.code === NEIGHBORS) {
      return bordering[comparingCountry?.code];
    }
    if (selectedCountry?.code === WORLD || selectedCountry?.code === COUNTRY) {
      return Object.keys(bordering);
    }
    if (selectedCountry?.group === ORGANIZATION) {
      return organizations?.[selectedCountry?.code];
    }
    return [];
  }, [comparingCountry, selectedCountry]);

  useEffect(() => {
    dispatch(
      fetchRankingData({
        comparing_country: comparingCountry?.code,
        selected_countries: highlights,
      }),
    );
  }, [highlights, comparingCountry, dispatch]);

  useEffect(() => {
    const chartLabels = getRadialChartLabes(metrics);
    const indicatorsTypeMap = getIndicatorsTypemap();

    const metricsData = [];

    const outerRadiusPercentage = 175
      / (getCountries(comparingCountry?.code, selectedCountry?.code)?.length + 1);

    const maxRanking = Math.max(
      ...(metrics?.map((metric) => metric.ranking) || [0]),
    );

    metrics?.forEach((d, i) => {
      const metric = { ...d };
      metric.startAngle = i * eachAngle;
      metric.endAngle = (i + 1) * eachAngle;
      const zeroRadius = valueScale(0);
      if (metric.ranking > 0) {
        metric.innerRadius = zeroRadius;
        metric.outerRadius = valueScale((((1 + maxRanking) - d.ranking) * outerRadiusPercentage));
      } else {
        metric.innerRadius = valueScale(d.ranking);
        metric.outerRadius = zeroRadius;
      }
      metricsData.push(metric);
    });

    const selectedIndicatorData = metricsData.filter(
      (metric) => metric.indicatorId === selectedIndicator,
    )[0];

    // chart container
    const svg = d3.select(radialChart.current)
      .style('background-color', 'transparent')
      .append('g')
      .attr('id', 'removeme');

    const center = svg
      .selectAll('.center')
      .data([1])
      .join('g')
      .attr('class', 'center')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const getElementAngle = (element) => {
      const startAngle = element?.startAngle || 0;
      const endAngle = element?.endAngle || 0;

      return -(((endAngle - startAngle) / 2 + startAngle) * 180) / Math.PI;
    };

    const angle = (() => {
      const initialElement = previousSelectedIndicator
        ? metricsData.find((x) => x.indicatorId === previousSelectedIndicator)
        : null;

      const element = metricsData.find(
        (x) => x.indicatorId === selectedIndicator,
      );

      return [
        initialElement ? getElementAngle(initialElement) : 0,
        element ? getElementAngle(element) : 0,
      ];
    })();

    const radialElementsContainer = center
      .append('g')
      .attr('class', 'radial-elements')
      // .style("transform", `rotate(${angle}deg)`)
      .style('--initial-rotation', `${angle[0]}deg`)
      .style('--end-rotation', `${angle[1]}deg`);

    const arc = d3
      .arc()
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle);

    // bars
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('height', '50px')
      .attr('class', styles.tooltip)
      .style('opacity', 0);

    const mouseOver = function (d) {
      d3.selectAll('.radial-bar')
        .transition()
        .duration(200)
        // .style('opacity', 0.5)
        .style('stroke', 'transparent');
      d3.select(this)
        .transition()
        .duration(200)
        // .style('opacity', 1)
        .style('stroke', 'black');
      tooltip
        .html(
          `<div style="margin-bottom:5px;text-align:center">
                <img
                  loading="lazy"
                  width="30"
                  src=${
  getTooltipData(d.target?.__data__?.indicator, metricsData)
    .imgSrc
}
                  srcSet=${
  getTooltipData(d.target?.__data__?.indicator, metricsData)
    .imgSrcSet
}
                  alt="${countries[comparingCountry.code]} flag"
                />
              </div>
              <strong style="font-size:14px">${
  d.target?.__data__?.indicator
}</strong>
              <br>
              <strong>Ranking:</strong> ${
  getTooltipData(d.target?.__data__?.indicator, metricsData)
    .ranking
}
              <br>
              <strong>Score:</strong> ${
  getTooltipData(d.target?.__data__?.indicator, metricsData).value
}`,
        )
        .style('left', `${d.pageX}px`)
        .style('top', `${d.pageY - 28}px`)
        .style('z-index', '2')
        .style('background', 'white')
        .style('position', 'absolute')
        .transition()
        .duration(400)
        .style('opacity', 1);
    };

    const mouseLeave = function () {
      d3.selectAll('.radial-bar')
        .transition()
        .duration(200)
        // .style('opacity', 0.5)
        .style('stroke', 'transparent');
      tooltip.transition().duration(300).style('opacity', 0);
    };

    radialElementsContainer
      .selectAll('.radial-bar')
      .data(metricsData || [])
      .join('path')
      .attr('class', 'radial-bar')
      .attr('opacity', (d) => (d.indicatorId === selectedIndicator ? 1 : 0.5))
      .attr('cursor', 'pointer')
      .attr('d', (d) => arc(d))
      .attr('fill', (d) => INDICATORS_TYPE_MAP[LABELS_MAP[d.indicator].type])
      .on('mouseover', mouseOver)
      .on('mouseleave', mouseLeave)
      .on('click', (d) => {
        const { indicatorId } = d3.select(d.currentTarget).datum();
        dispatch(changeSelectedIndicator(indicatorId));
        // mouseLeave();
      });

    // outer and inner circles
    center
      .selectAll('.radial-circle')
      .data([-34, COUNTRIES_QTY])
      .join('circle')
      .attr('r', (d) => valueScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#EEEEEE')
      .attr('border', '1px solid #EEEEEE');

    const g = center
      .append('g')
      // .style('--initial-rotation', `${angle[0]}deg`)
      // .style('--end-rotation', `${angle[1]}deg`)
      .attr('transform', `rotate(${angle[0]})`)
      .selectAll('.radial-axis-g')
      .data(chartLabels)
      .join('g')
      .attr('font-family', 'Montserrat')
      .attr('transform', (d, i) => {
        const angle = (360 / INDICATORS_QTY) * i - 90;
        return `rotate(${angle})`;
      });

    // lines between categories
    g.append('line')
      .attr('x1', minInnerRadius)
      .attr('y1', 0)
      .attr('x2', maxOuterRadius)
      .attr('y2', 0)
      .attr('stroke', '#EEEEEE40')
      .attr('opacity', 0.2);

    const categories = [];

    chartLabels.forEach((label) => {
      categories.push({
        label,
        value: 1,
      });
    });

    // indicators pie in the center of the chart
    const piewidth = 532;
    const radius = piewidth / 2;

    const formattedData = d3.pie().value((d) => d.value)(categories);
    const arcGenerator = d3.arc().innerRadius(245).outerRadius(radius);

    // indicator labels
    radialElementsContainer
      .selectAll()
      .data(formattedData)
      .join('path')
      .attr('d', arcGenerator)
      .attr('id', (d) => d.data.label)
      .attr('fill', (d) => INDICATORS_TYPE_MAP[indicatorsTypeMap[d.data.label]])
      .attr('class', 'center');
    // .attr("transform", `translate(${width / 2},${height / 2})`);

    const mouseOverText = function (d) {
      if (d.target.scrollHeight > d.target.clientHeight + 3) {
        tooltip
          .text(d.srcElement.innerText)
          .style('left', `${d.pageX}px`)
          .style('top', `${d.pageY - 28}px`)
          .style('z-index', '2')
          .style('background', 'white')
          .style('position', 'absolute')
          .style('font-weight', 'bold')
          .transition()
          .duration(400)
          .style('opacity', 1);
      }
    };

    categories.forEach((category) => {
      const text = radialElementsContainer
        .append('text')
        .attr('x', 7)
        .attr('dy', 13);

      text
        .append('textPath')
        .attr('fill', '#01012B')
        .attr('font-family', 'Monstserrat')
        .style('text-anchor', 'start')
        .attr('font-weight', 700)
        .attr('font-size', '10px')
        .attr('overflow', 'ellipsis')
        .attr('xlink:href', `#${category.label}`)
        .text(setEllipsis(category.label, 4).toUpperCase());
    });

    const indicatorLabel = center
      .append('foreignObject')
      .attr('x', -100)
      .attr('y', -225)
      .style('width', 200)
      .style('height', 60)
      .append('xhtml:div')
      .append('div')
      .attr('class', radialStyles.centerLegendContainer)
      .on('mouseover', mouseOverText)
      .on('mouseleave', mouseLeave)
      .style('width', '200px')
      .style('height', '60px');

    indicatorLabel
      .append('div')
      .attr('class', radialStyles.indicatorLabel)
      .style('font-weight', 700)
      .html(`${indicators[selectedIndicator].indicator_name}`);

    //

    if (selectedIndicatorData) {
      selectedIndicatorData.sortedCountries = selectedIndicatorData?.sortedCountries.filter(
        (d) => d.value !== null && d.value !== undefined,
      );
    }
    const lowestCountryContainer = center
      .append('foreignObject')
      .attr('x', -175)
      .attr('y', -125)
      .style('width', 110)
      .style('height', 90)
      .append('xhtml:div')
      .append('div')
      .attr('class', radialStyles.centerLegendContainer);

    lowestCountryContainer
      .append('div')
      .on('mouseover', mouseOverText)
      .on('mouseleave', mouseLeave)
      .attr('class', radialStyles.clcCountryLabel)
      .html(`${countries[selectedIndicatorData?.sortedCountries[0].country]}`);

    lowestCountryContainer
      .append('div')
      .attr('class', radialStyles.clcCountryValue)
      .html(`${abbreviateNumber(selectedIndicatorData?.sortedCountries[0].value) || '-'}`);

    lowestCountryContainer
      .append('div')
      .attr('class', radialStyles.clcCountryLegend)
      .html('Lowest Ranked');

    const highestCountryContainer = center
      .append('foreignObject')
      .attr('x', 65)
      .attr('y', -125)
      .style('width', 110)
      .style('height', 90)
      .append('xhtml:div')
      .append('div')
      .attr('class', radialStyles.centerLegendContainer);

    highestCountryContainer
      .append('div')
      .attr('class', radialStyles.clcCountryLabel)
      .on('mouseover', mouseOverText)
      .on('mouseleave', mouseLeave)
      .html(
        `${
          countries[
            selectedIndicatorData?.sortedCountries[
              selectedIndicatorData.sortedCountries.length - 1
            ].country
          ]
        }`,
      );

    highestCountryContainer
      .append('div')
      .attr('class', radialStyles.clcCountryValue)
      .html(`${abbreviateNumber(selectedIndicatorData?.sortedCountries[selectedIndicatorData.sortedCountries.length - 1].value) || '-'}`);

    highestCountryContainer.append('div')
      .attr('class', radialStyles.clcCountryLegend)
      .html('Highest Ranked');

    const comparingCountryContainer = center
      .append('foreignObject')
      .attr('x', -55)
      .attr('y', -145)
      .style('width', 110)
      .style('height', 90)
      .append('xhtml:div')
      .append('div')
      .attr('class', radialStyles.centerLegendContainer);

    comparingCountryContainer
      .append('div')
      .attr('class', radialStyles.clcCountryLabel)
      .on('mouseover', mouseOverText)
      .on('mouseleave', mouseLeave)
      .style('font-weight', 700)
      .html(`${comparingCountry?.label}`);

    comparingCountryContainer
      .append('div')
      .attr('class', radialStyles.clcCountryValue)
      .html(`${abbreviateNumber(selectedIndicatorData?.sortedCountries.find((c) => c.country === comparingCountry.code)?.value) || '-'}`);

    comparingCountryContainer.append('div')
      .attr('class', radialStyles.clcCountryLegend)
      .html('Selected Ranked');

    // Indicator Type circles and legends (top right corner)
    let circleYPosition = 15;
    let legendYPosition = 10;

    // legends
    Object.keys(INDICATORS_TYPE_MAP).forEach((indicatorType) => {
      svg.append('circle')
        .attr('cx', 700)
        .attr('cy', circleYPosition)
        .attr('r', 10)
        .attr('fill', INDICATORS_TYPE_MAP[indicatorType]);

      svg
        .append('text')
        .attr('text-anchor', 'start')
        .attr('x', 610)
        .attr('y', legendYPosition)
        .attr('transform', 'translate(110,10)')
        .attr('fill', '#FFFFFF')
        .style('font-size', 12)
        .style('font-weight', 400)
        .style('font-family', 'Montserrat')
        .text(capitalizeFirstLetter(indicatorType));

      circleYPosition += 28;
      legendYPosition += 28;
    });

    if (selectedIndicatorData?.sortedCountries.length > 10) {
      // workaround
      const duplicateCount = selectedIndicatorData?.sortedCountries.reduce(
        (prev, curr) => (curr.country === comparingCountry.code ? prev + 1 : prev),
        0,
      );
      if (duplicateCount > 1) {
        // remove duplicate
        const removeIndex = selectedIndicatorData?.sortedCountries.findIndex(
          (c) => c.country === comparingCountry.code,
        );
        selectedIndicatorData.sortedCountries = selectedIndicatorData?.sortedCountries.reduce(
          (prev, curr, i) => (i === removeIndex ? [...prev] : [...prev, curr]),
          [],
        );
      }
      if (selectedIndicatorData?.sortedCountries.length > 21) {
        selectedIndicatorData.sortedCountries = selectedIndicatorData?.sortedCountries.filter(
          (country, i) => country.country === comparingCountry.code || i % 4 === 0,
        );
      }
      // Bar Chart
      const barChart = svg.append('g');
      const barChartWidth = 495;
      const barChartHeight = 300;
      const margin = {
        top: 70, bottom: 50, left: 50, right: 85,
      };

      function onMouseEnter(d) {
        const bar = d3.select(this)
          .attr('stroke', 'black');
        const barData = bar.datum();
        const tooltipHtml = `
                <b>${countries[barData.country]}</b>
                <hr />
                <b>${indicators[selectedIndicator].indicator_name}: </b>${barData.value}
            `;
        tooltip
          .style('left', `${d.layerX + 15}px`)
          .style('top', `${d.layerY - 28}px`)
          .html(tooltipHtml)
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style('max-width', '300px');
      }
      function onMouseLeave() {
        d3.select(this)
          .attr('stroke', 'transparent');

        tooltip.transition().duration(200).style('opacity', 0);
      }

      barChart
        .selectAll()
        .attr('width', barChartWidth - margin.left - margin.right)
        .attr('height', barChartHeight - margin.top - margin.bottom)
        .attr('viewBox', [0, 0, barChartWidth, barChartHeight]);

      const x = d3
        .scaleBand()
        .domain(d3.range(selectedIndicatorData?.sortedCountries.length))
        .range([margin.left, barChartWidth - margin.right]);

      const maxYRange = Math.max.apply(
        Math,
        selectedIndicatorData?.sortedCountries.map((d) => d.value),
      );

      const y = d3
        .scaleLinear()
        .domain([0, maxYRange])
        .range([barChartHeight - margin.bottom, margin.top]);

      svg
        .append('g')
        .selectAll('rect')
        .data(
          selectedIndicatorData?.sortedCountries
            ? selectedIndicatorData?.sortedCountries
            : [],
        )
        .join('rect')
        .attr('x', (d, i) => barChartWidth - 10 - x(i))
        .attr('y', (d) => y(d.value))
        .attr('title', (d) => d.value)
        .attr('isocc', (d) => d.country)
        .attr('fill', (d, i) => getBarColor(selectedIndicatorData?.sortedCountries, d.country, i))
        .attr('class', 'rect')
        .attr('height', (d) => y(0) - y(d.value))
        .attr(
          'width',
          4,
        )
        .style('cursor', 'pointer')
        .on('mouseover', onMouseEnter)
        .on('mouseleave', onMouseLeave)
        .attr('transform', `translate(${getBarXPosition()}, 280)`);
    } else {
      // countries Chart
      const barChart = svg.append('g');
      const barChartWidth = 450;
      const barChartHeight = 300;
      const margin = {
        top: 50, bottom: 50, left: 50, right: 50,
      };

      barChart.selectAll()
        .attr('width', barChartWidth - margin.left - margin.right)
        .attr('height', barChartHeight - margin.top - margin.bottom)
        .attr('viewBox', [0, 0, barChartWidth, barChartHeight]);

      const {
        xMin,
        xMax,
      } = {
        xMin: Math.min.apply(Math, selectedIndicatorData?.sortedCountries.map((x) => x.value)),
        xMax: Math.max.apply(Math, selectedIndicatorData?.sortedCountries.map((x) => x.value)),
      };

      const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([margin.left, barChartWidth - margin.right]);

      barChart.append('g')
        .attr('transform', 'translate(150,500)')
        .style('color', 'hsla(0, 0%, 93%, 0.7)')
        .call(d3.axisBottom(x).ticks(5).tickFormat((v) => abbreviateNumber(v)));

      svg
        .append('g')
        .selectAll('g')
        .data(selectedIndicatorData?.sortedCountries ? selectedIndicatorData?.sortedCountries : [])
        .join('g')
        .attr('transform', (d) => `translate(${x(d.value) - 23}, -70)`)
        .append('path')
        .attr('width', '47')
        .attr('height', '68')
        .attr('viewBox', '0 0 47 68')
        .attr('d', 'M0.85908 23.9301C0.808557 23.8311 0.77669 23.7396 0.76432 23.6292C0.5416 21.6415 -1.20447 0.746582 23.8168 0.746582C48.8381 0.746582 47.092 21.6415 46.8693 23.6292C46.8569 23.7396 46.8251 23.8311 46.7745 23.9301L24.7074 67.1449C24.3362 67.8718 23.2974 67.8718 22.9262 67.1449L0.85908 23.9301Z')
        .attr('fill', '#59C3C3CC')
        // .attr('stroke', (d) => (d.country === comparingCountry.code ? 'black' : 'transparent'))
        .attr('stroke-width', 4)
        .attr('stroke-opacity', 1)
        .attr('opacity', 0.8)
        .attr('transform', 'translate(150, 500)');

      setTimeout(() => { // terrible workaround
        svg
          .append('g')
          .selectAll('foreignObject')
          .data(selectedIndicatorData?.sortedCountries ? selectedIndicatorData?.sortedCountries : [])
          .join('foreignObject')
          .attr('x', (d) => `${x(d.value) + 136}`)
          .attr('y', '437')
          .attr('width', 30)
          .attr('height', 30)
          .append('xhtml:div')
          .style('height', '30px')
          .style('height', '30px')
          .style('background-size', 'cover')
          .style('background-position', 'center')
          .style('border-radius', '50%')
          .style('border', '1px solid')
          .style('box-sizing', 'border-box')
          .style('background-image', (d) => `url(https://flagcdn.com/w40/${getCountryISO2(d.country).toLowerCase()}.png)`)
          .html('&nbsp;&nbsp;');
      });

      // flags

      // <img
      //           loading="lazy"
      //           width="30"
      //           src=${getTooltipData(d.target?.__data__?.indicator, metricsData).imgSrc}
      //           srcSet=${getTooltipData(d.target?.__data__?.indicator, metricsData).imgSrcSet}
      //           alt="${countries[comparingCountry.code]} flag"
      //         />

      // svg
      //   .append('g')
      //   .selectAll('rect')
      //   .data(selectedIndicatorData?.sortedCountries ? selectedIndicatorData?.sortedCountries : [])
      //   .join('g')
      //   .attr('transform', (d) => `translate(${x(d.value) - 23}, -70)`)
      //   .append('path')
      //   .attr('d', 'M0.85908 23.9301C0.808557 23.8311 0.77669 23.7396 0.76432 23.6292C0.5416 21.6415 -1.20447 0.746582 23.8168 0.746582C48.8381 0.746582 47.092 21.6415 46.8693 23.6292C46.8569 23.7396 46.8251 23.8311 46.7745 23.9301L24.7074 67.1449C24.3362 67.8718 23.2974 67.8718 22.9262 67.1449L0.85908 23.9301Z')
      //   // .attr('fill', '#59C3C3CC')
      //   .attr('fill', 'transparent')
      //   .attr('stroke', 'white')
      //   .attr('opacity', 1)
      //   .attr('transform', 'translate(150, 500)');
    }
    return () => {
      d3.select(radialChart.current).select('#removeme').remove();
      tooltip.remove();
    };
  }, [comparingCountry, selectedCountry, selectedIndicator, metrics]);

  return (
    <div
      id="radialChartContainer"
      style={{
        width: '65%',
        height: '65%',
        display: 'flex',
        justifyContent: 'left',
        margin: '0 auto',
        paddingLeft: '2rem',
      }}
    >
      <svg viewBox={`0 0 ${width + 80} ${height}`} ref={radialChart} />
    </div>
  );
}

export default RadialChart;
