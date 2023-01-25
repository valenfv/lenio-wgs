import React from 'react';
import * as d3 from 'd3';
import styles from '../styles/commons.module.css';

import indicators from '../data/indicators.json';
import countries from '../data/iso_country.json';
import bordering from '../data/bordering_countries.json';

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


export const useScatterPlot = ({ svgRef, data, highlights, indicatorX, indicatorY, comparingCountry }) => {
    React.useEffect(() => {
        if (!data || !comparingCountry) return;

        const onMouseEnter = function (d) {
            const element = d3.select(this);
            const datum = element.datum();
            if (datum.isoCc === comparingCountry.code) {
                element
                    .transition()
                    .duration(200)
                    .style('fill', '#386e62')
            } else {
                // 
                element
                    .transition()
                    .duration(200)
                    .attr('stroke', '#ED762F')
            }
            const pepe = `
                <b>Name: </b>${countries[datum.isoCc]}
                <br />
                <b>${indicatorX.indicator_name}: </b>${datum[indicatorX.id]}
                <br />
                <b>${indicatorY.indicator_name}: </b>${datum[indicatorY.id]}
            `;
            tooltip
                .style("left", d.pageX + 15 + "px")
                .style("top", d.pageY - 28 + "px")
                .html(pepe)
                .transition()
                .duration(400)
                .style("opacity", 1);
        }

        const onMouseLeave = function (d) {
            const element = d3.select(this);
            if (element.datum().isoCc === comparingCountry.code) {
                element
                    .transition()
                    .duration(200)
                    .style('fill', '#69b3a2')
            } else {
                // 
                element
                    .transition()
                    .duration(200)
                    .attr('stroke', 'transparent')
            }
            tooltip.transition().duration(300).style("opacity", 0);
        }

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 90, bottom: 60, left: 30 },
            width = SCATTERPLOT_WIDTH - margin.left - margin.right,
            height = SCATTERPLOT_HEIGHT - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // tooltip
        var tooltip = d3.select(svgRef.current)
            .append("div")
            .attr("class", styles.dataTooltip)
            .style("opacity", 0);

        // Add X axis
        var x = d3.scaleLinear()
            .domain([indicatorX.min, indicatorX.max])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .style('color', 'hsla(0, 0%, 93%, 0.7)')
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([indicatorY.min, indicatorY.max])
            .range([height, 0]);
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .style('color', 'hsla(0, 0%, 93%, 0.7)')
            .call(d3.axisRight(y));

        // labels

        svg.append('text')
            .attr('class', `${styles.axis} ${styles.svgText}`)
            .attr('x', width / 2)
            .attr('y', height + 40)
            .attr("text-anchor", "middle")
            .text(indicatorX.indicator_name)

        svg.append('text')
            .attr('class', `${styles.axis} ${styles.svgText}`)
            .attr('x', -height / 2)
            .attr('y', width + 60)
            .attr("text-anchor", "middle")
            .attr('transform', 'rotate(-90)')
            .text(indicatorY.indicator_name)

        // Add dots
        const cloud = svg.append('g');

        cloud.selectAll("dot")
            .data(data)
            .enter()
            .filter(d => d.isoCc !== comparingCountry.code)
            .append("circle")
            .attr("cx", function (d) { return x(d[indicatorX.id]); })
            .attr("cy", function (d) { return y(d[indicatorY.id]); })
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .on("mouseover", onMouseEnter)
            .on("mouseleave", onMouseLeave);

        const comparingCountryData = data.find(c => c.isoCc === comparingCountry.code);
        cloud
            .datum(comparingCountryData)
            .append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x', x(comparingCountryData[indicatorX.id]) - 8)
            .attr('y', y(comparingCountryData[indicatorY.id]) - 8)
            .attr('country-isocc', comparingCountry)
            .style("fill", "#69b3a2")
            //.attr('stroke', '#ED762F')
            .on("mouseover", onMouseEnter)
            .on("mouseleave", onMouseLeave);

        return () => {
            d3.select(svgRef.current).select('svg').remove();
        }
    }, [svgRef, data, indicatorX, indicatorY, comparingCountry]);

    React.useEffect(() => {
        if (!data) return;
        if (highlights && highlights.length) {
            // highlight countries in the list and change the opacity to others
            d3.select(svgRef.current)
                .selectAll('circle')
                .filter(country => !highlights.includes(country.isoCc))
                .transition()
                .duration(500)
                .style('opacity', '0.3')
                .attr('r', '5')
            return () => {
                d3.select(svgRef.current)
                    .selectAll('circle')
                    .filter(country => !highlights.includes(country.isoCc))
                    .transition()
                    .duration(500)
                    .style('opacity', '1')
            };
        }
    }, [data, highlights, svgRef, comparingCountry]);
} 