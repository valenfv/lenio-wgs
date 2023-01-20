import React from 'react';
import * as d3 from 'd3';
import styles from '../styles/commons.module.css';

import indicators from '../data/indicators.json';
import countries from '../data/countries.json';

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

export const generateData = (indicatorX, indicatorY) => {
    /*
        indicator {
            id,
            indicator_name,
            min,
            max,
        }
    */
    //console.log(countries, indicators)

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    return countries.map((country, index) => {
        return ({
            isoCc: country['alpha-3'],
            name: country.name,
            [indicatorX.id]: randomIntFromInterval(indicatorX.min, indicatorX.max),
            [indicatorY.id]: randomIntFromInterval(indicatorY.min, indicatorY.max),
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
        })
    });
}

export const useScatterPlot = (svgRef, plotData) => {
    React.useEffect(() => {
        if (!plotData) return;

        const {
            comparing,
            indicatorX,
            indicatorY,
            data,
        } = plotData;

        const onMouseEnter = function (d) {
            const element = d3.select(this);
            console.log(element.datum().isoCc, comparing)
            const datum = element.datum();
            if (datum.isoCc === comparing) {
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
                <b>Name: </b>${datum.name}
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
            if (element.datum().isoCc === comparing) {
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
            .attr('class', styles.axis)
            .attr('x', width / 2)
            .attr('y', height + 40)
            .attr("text-anchor", "middle")
            .text(indicatorX.indicator_name)

        svg.append('text')
            .attr('class', styles.axis)
            .attr('x', -height / 2)
            .attr('y', width + 70)
            .attr("text-anchor", "middle")
            .attr('transform', 'rotate(-90)')
            .text(indicatorY.indicator_name)

        // Add dots
        const cloud = svg.append('g');

        cloud.selectAll("dot")
            .data(data)
            .enter()
            .filter(d => d.isoCc !== comparing)
            .append("circle")
            .attr("cx", function (d) { return x(d[indicatorX.id]); })
            .attr("cy", function (d) { return y(d[indicatorY.id]); })
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .on("mouseover", onMouseEnter)
            .on("mouseleave", onMouseLeave)
            .attr('country-name', d => d.name)
            .attr('country-isocc', d => d.isoCc);

        const comparingCountry = data.find(c => c.isoCc === comparing);

        cloud
            .datum(comparingCountry)
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('x', x(comparingCountry[indicatorX.id]))
            .attr('y', y(comparingCountry[indicatorY.id]))
            .attr('country-isocc', comparing)
            .style("fill", "#69b3a2")
            //.attr('stroke', '#ED762F')
            .on("mouseover", onMouseEnter)
            .on("mouseleave", onMouseLeave);

        return () => {
            d3.select(svgRef.current).select('svg').remove();
        }
    }, [plotData]);
} 