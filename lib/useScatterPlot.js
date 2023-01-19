import React from 'react';
import * as d3 from 'd3';
import styles from '../styles/commons.module.css';

import indicators from '../data/indicators.json';
import countries from '../data/countries.json';

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

        const onMouseEnter = function (d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke', '#ED762F')
        }

        const onMouseLeave = function (d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke', 'transparent')

        }
        const {
            comparing,
            indicatorX,
            indicatorY,
            data,
        } = plotData;

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 90, bottom: 60, left: 30 },
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


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

        cloud.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', x(comparingCountry[indicatorX.id]))
            .attr('y', y(comparingCountry[indicatorY.id]))
            .style("fill", "white");

        return () => {
            d3.select(svgRef.current).select('svg').remove();
        }
    }, [plotData]);
} 