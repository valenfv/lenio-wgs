import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedIndicator, getRadialChartData } from '../slices/radialChartSlice';
import getCountryISO2 from 'country-iso-3-to-2';
import endpoint_data from "../data/endpoint_data.json";
import { COUNTRIES_QTY, LABELS_MAP, INDICATORS_QTY, INDICATORS_TYPE_MAP } from '../constants/radialChart';
import { capitalizeFirstLetter, setEllipsis, formatRadialChartData, getRadialChartLabes, getIndicatorsTypemap } from '../lib/helpers';
import styles from '../styles/world.module.css';
import countries from '../data/iso_country.json'
import * as d3 from 'd3';

const RadialChart = () => {
    const radialChart = useRef();
    const dispatch = useDispatch();
    const {
      comparingCountry,
      selectedCountry,
      selectedIndicator,
      metrics,
      selectedIndicatorData
    } = useSelector((state) => ({
      comparingCountry: state.sidebar.comparingCountry,
      selectedCountry: state.sidebar.selectedCountry,
      selectedIndicator: state.radialChart.selectedIndicator,
      metrics: state.radialChart.metrics,
      selectedIndicatorData: state.radialChart.selectedIndicatorData
    }));
    const width = 750;
    const height = 750;
    const maxOuterRadius = (width / 2);
    const minInnerRadius = (width / 2) * 0.70;
    const valueScale = d3
      .scaleLinear()
      .domain([- 6, COUNTRIES_QTY])
      .range([minInnerRadius, maxOuterRadius]);
    let selectedCountryIndex;

    //Bar Chart functions
    const getBarColor = (data, country, index) => {
      if (data.length <= 50) {
        return country === comparingCountry?.code ? '#59C3C3CC' : '#59C3C340';
      } else {
        if (index%4 !== 0) {
          if (country === comparingCountry?.code) selectedCountryIndex = index - (index%4);
          return 'transparent';
        } else {
          return country === comparingCountry?.code || index === selectedCountryIndex ? '#59C3C3CC' : '#59C3C340';
        }
      };
    };

    const getBarXPosition = () => {
      if (selectedIndicatorData?.sortedCountries.length < 6) return 115;
      return selectedIndicatorData?.sortedCountries.length < 21 ? 145 : 155
    };

    const getTooltipData = (indicator, metrics) => {
      const country = metrics.filter(ind => ind.indicator === indicator)[0];
      const imgSrc = `https://flagcdn.com/w20/${String(getCountryISO2(comparingCountry?.code)).toLowerCase()}.png`;
      const imgSrcSet = `https://flagcdn.com/w40/${String(getCountryISO2(comparingCountry?.code)).toLowerCase()}.png 2x`
      return {
        ranking: country.ranking,
        value: country.sortedCountries?.filter(item => item.country === comparingCountry?.code)[0]?.value,
        imgSrc,
        imgSrcSet
      };
    };

    useEffect(() => {
      dispatch(getRadialChartData(formatRadialChartData(endpoint_data, selectedIndicator, width, height, valueScale)));
    }, []);

    useEffect(() => {
      const chartLabels = getRadialChartLabes(metrics);
      const indicatorsTypeMap = getIndicatorsTypemap();

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

        const arc = d3
          .arc()
          .innerRadius((d) => d.innerRadius)
          .outerRadius((d) => d.outerRadius)
          .startAngle((d) => d.startAngle)
          .endAngle((d) => d.endAngle);

        // bars
        const tooltip = d3.select('body').append('div')
          .attr('height', "50px")
          .attr('class', styles.tooltip)
          .style('opacity', 0);

        const mouseOver = function (d) {
          d3.selectAll('.radial-bar')
            .transition()
            .duration(200)
            .style('opacity', 0.5)
            .style('stroke', 'transparent');
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('stroke', 'black');
          tooltip.html(
              `<div style="margin-bottom:5px;text-align:center">
                <img
                  loading="lazy"
                  width="30"
                  src=${getTooltipData(d.target?.__data__?.indicator, metrics).imgSrc}
                  srcSet=${getTooltipData(d.target?.__data__?.indicator, metrics).imgSrcSet}
                  alt="${countries[comparingCountry.code]} flag"
                />
              </div>
              <strong style="font-size:14px">${d.target?.__data__?.indicator}</strong>
              <br>
              <strong>Ranking:</strong> ${getTooltipData(d.target?.__data__?.indicator, metrics).ranking}
              <br>
              <strong>Score:</strong> ${getTooltipData(d.target?.__data__?.indicator, metrics).value}`
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
            .style('opacity', 1)
            .style('stroke', 'transparent');
          tooltip.transition().duration(300)
            .style('opacity', 0)
        };

        center
          .selectAll('.radial-bar')
          .data(metrics ? metrics : [])
          .join('path')
          .attr('class', 'radial-bar')
          .attr('cursor', 'pointer')
          .attr('d', (d) => arc(d))
          .attr('fill', d => INDICATORS_TYPE_MAP[LABELS_MAP[d.indicator].type])
          .on('mouseover', mouseOver)
          .on('mouseleave', mouseLeave)
          .on('click', (d) => {
            dispatch(getSelectedIndicator(d.target.__data__.indicator));
            mouseLeave();
          })

        // outer and inner circles
        center
          .selectAll('.radial-circle')
          .data([-34, COUNTRIES_QTY])
          .join('circle')
          .attr('r', (d) => valueScale(d))
          .attr('fill', 'none')
          .attr('stroke', '#EEEEEE')
          .attr('border', `1px solid #EEEEEE`)

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
          .attr('stroke', '#EEEEEE40')
          .attr('opacity', 0.2);

          const categories = [];

          chartLabels.forEach(label => {
            categories.push({
              label,
              value: 1
            })
          })

          // indicators pie in the center of the chart
          const piewidth = 532;
          const radius = piewidth / 2;

          const formattedData = d3.pie().value(d => d.value)(categories);
          const arcGenerator = d3.arc().innerRadius(245).outerRadius(radius);

          const pie = svg.append('g');

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
              .attr("x", index > 8 && index < 27 ? 75 : 7)
              .attr("dy", 13)

            text.append("textPath")
              .attr("fill","#01012B")
              .attr('font-family', 'Monstserrat')
              .style('text-anchor', 'start')
              .attr('font-weight', 700)
              .attr('font-size', '12px')
              .attr('overflow', 'ellipsis')
              .attr("xlink:href", `#${category.label}`)
              .text(setEllipsis(category.label, 4));
          });

          // Selected indicator heading, selected country and score, highest country and score, lowest country and score
          center
            .append('text')
            .text(`${setEllipsis(selectedIndicator, 22)}${selectedIndicator.length < 16 ? ' Rankings' : ''}`)
            .attr('fill', '#DDDDDD')
            .attr('overflow', 'hidden')
            .attr('font-family', 'arial')
            .attr('font-weight', 700)
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0,-205)')
            .append('title')
            .text(selectedIndicator.length > 22 ? selectedIndicator : '')

          center
            .append('text')
            .text(`${selectedIndicator.length > 15 ? ' Rankings' : ''}`)
            .attr('fill', '#DDDDDD')
            .attr('overflow', 'hidden')
            .attr('font-family', 'arial')
            .attr('font-weight', 700)
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0,-190)');

          center
            .append('text')
            .text(comparingCountry?.label)
            .attr('fill', '#DDDDDD')
            .attr('font-family', 'arial')
            .attr('font-weight', 700)
            .attr('font-size', '18px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0,-165)');

          center
            .append('text')
            .text(selectedIndicatorData?.ranking)
            .attr('fill', '#DDDDDD')
            .attr('font-family', 'arial')
            .attr('font-weight', 700)
            .attr('font-size', '22px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0,-135)');

          center
            .append('text')
            .text('Selected Country')
            .attr('fill', '#FFFFFF80')
            .attr('font-family', 'arial')
            .attr('font-weight', 700)
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(0,-110)');

          center
            .append('text')
            .text(countries[selectedIndicatorData?.sortedCountries[0].country])
            .attr('fill', '#DDDDDD')
            .attr('font-family', 'arial')
            .attr('font-weight', 400)
            .attr('font-size', '18px')
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(-180,-145)');

          center
            .append('text')
            .text(selectedIndicatorData?.sortedCountries[0].value)
            .attr('fill', '#DDDDDD')
            .attr('font-family', 'arial')
            .attr('font-weight', 400)
            .attr('font-size', '22px')
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(-150,-115)');

          center
            .append('text')
            .text('Lowest ranking')
            .attr('fill', '#FFFFFF80')
            .attr('font-family', 'arial')
            .attr('font-weight', 400)
            .attr('font-size', '14px')
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(-185,-90)');

          center
            .append('text')
            .text(countries[selectedIndicatorData?.sortedCountries[selectedIndicatorData.sortedCountries.length -1].country])
            .attr('fill', '#DDDDDD')
            .attr('font-family', 'arial')
            .attr('font-weight', 400)
            .attr('font-size', '18px')
            .attr('text-anchor', 'end')
            .attr('transform', 'translate(180,-145)');

          center
            .append('text')
            .text(selectedIndicatorData?.sortedCountries[selectedIndicatorData.sortedCountries.length -1].value)
            .attr('fill', '#DDDDDD')
            .attr('font-family', 'arial')
            .attr('font-weight', 400)
            .attr('font-size', '22px')
            .attr('text-anchor', 'end')
            .attr('transform', 'translate(170,-115)');

          center
            .append('text')
            .text('Highest ranking')
            .attr('fill', '#FFFFFF80')
            .attr('font-family', 'arial')
            .attr('font-weight', 400)
            .attr('font-size', '14px')
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(105,-90)');

          // Indicator Type circles and legends (top right corner)
          let circleYPosition = 15;
          let legendYPosition = 10;

          Object.keys(INDICATORS_TYPE_MAP).forEach(indicatorType => {
            svg.append('circle')
              .attr('cx', 660)
              .attr('cy', circleYPosition)
              .attr('r', 10)
              .attr('fill', INDICATORS_TYPE_MAP[indicatorType])

            svg.append('text')
              .attr('text-anchor', 'start')
              .attr('x', 570)
              .attr('y',legendYPosition)
              .attr('transform', 'translate(110,10)')
              .attr('fill', '#FFFFFF')
              .style("font-size", 12)
              .style("font-weight", 400)
              .style("font-family", 'Montserrat')
              .text(capitalizeFirstLetter(indicatorType));

            circleYPosition += 28;
            legendYPosition += 28;
          });

          // Bar Chart
          const barChart = svg.append('g');
          const barChartWidth = 450;
          const barChartHeight = 300;
          const margin = { top: 50, bottom: 50, left: 50, right: 50 };

          barChart.selectAll()
            .attr('width', barChartWidth - margin.left - margin.right)
            .attr('height', barChartHeight - margin.top - margin.bottom)
            .attr("viewBox", [0, 0, barChartWidth, barChartHeight]);

          const x = d3.scaleBand()
            .domain(d3.range(selectedIndicatorData?.sortedCountries.length))
            .range([margin.left, barChartWidth - margin.right]);

          const y = d3.scaleLinear()
            .domain([0, selectedIndicatorData?.sortedCountries[0].value])
            .range([barChartHeight - margin.bottom, margin.top]);

          svg
            .append("g")
            .selectAll("rect")
            .data(selectedIndicatorData?.sortedCountries ? selectedIndicatorData?.sortedCountries : [])
            .join("rect")
              .attr("x", (d, i) => barChartWidth-10-x(i))
              .attr("y", d => y(d.value))
              .attr('title', (d) => d.value)
              .attr("fill", (d, i) => getBarColor(selectedIndicatorData?.sortedCountries, d.country, i))
              .attr("class", "rect")
              .attr("height", d => y(0) - y(d.value))
              .attr("width", selectedIndicatorData?.sortedCountries.length < 21 ? 14 : 4)
              .attr("transform", `translate(${getBarXPosition()}, 280)`);

  }, [comparingCountry, selectedCountry, selectedIndicator, metrics, selectedIndicatorData]);


    return (
        <div id='radialChartContainer'>
            <svg key={Math.random()} ref={radialChart}></svg>
        </div>
    );
};

export default RadialChart;