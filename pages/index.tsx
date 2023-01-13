import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getProcessedDataSet, ProcessedDataSetT } from '../lib/getProcessedDataSet';
import Link from 'next/link';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface HomePropsT {
  dataSet: ProcessedDataSetT;
}

const data = [{ "letter": "A", "frequency": 0.08167 }, { "letter": "B", "frequency": 0.01492 }, { "letter": "C", "frequency": 0.02782 }, { "letter": "D", "frequency": 0.04253 }, { "letter": "E", "frequency": 0.12702 }, { "letter": "F", "frequency": 0.02288 }, { "letter": "G", "frequency": 0.02015 }, { "letter": "H", "frequency": 0.06094 }, { "letter": "I", "frequency": 0.06966 }, { "letter": "J", "frequency": 0.00153 }, { "letter": "K", "frequency": 0.00772 }, { "letter": "L", "frequency": 0.04025 }, { "letter": "M", "frequency": 0.02406 }, { "letter": "N", "frequency": 0.06749 }, { "letter": "O", "frequency": 0.07507 }, { "letter": "P", "frequency": 0.01929 }, { "letter": "Q", "frequency": 0.00095 }, { "letter": "R", "frequency": 0.05987 }, { "letter": "S", "frequency": 0.06327 }, { "letter": "T", "frequency": 0.09056 }, { "letter": "U", "frequency": 0.02758 }, { "letter": "V", "frequency": 0.00978 }, { "letter": "W", "frequency": 0.0236 }, { "letter": "X", "frequency": 0.0015 }, { "letter": "Y", "frequency": 0.01974 }, { "letter": "Z", "frequency": 0.00074 }]

const BarChart = (data: any, {
  x = (d: any, i: any) => i, // given d in data, returns the (ordinal) x-value
  y = (d: any) => d, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  marginTop = 20, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 30, // the bottom margin, in pixels
  marginLeft = 40, // the left margin, in pixels
  width = 640, // the outer width of the chart, in pixels
  height = 400, // the outer height of the chart, in pixels
  xDomain, // an array of (ordinal) x-values
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // y-scale type
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  xPadding = 0.1, // amount of x-range to reserve to separate bars
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor" // bar fill color
}: any) => {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);

  // Compute default domains, and unique the x-domain.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  xDomain = new d3.InternSet(xDomain);

  // Omit any data not present in the x-domain. 
  const I = d3.range(X.length).filter((i: any) => xDomain.has(X[i]));

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Compute titles.
  if (title === undefined) {
    const formatValue = yScale.tickFormat(100, yFormat);
    title = (i: any) => `${X[i]}\n${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, (d: any) => d);
    const T = title;
    title = (i: any) => T(O[i], i, data);
  }

  const svg = d3.select("#bar-chart")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g: any) => g.select(".domain").remove())
    .call((g: any) => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call((g: any) => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(yLabel));

  const bar = svg.append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", (i: any) => xScale(X[i]))
    .attr("y", (i: any) => yScale(Y[i]))
    .attr("height", (i: any) => yScale(0) - yScale(Y[i]))
    .attr("width", xScale.bandwidth());

  if (title) bar.append("title")
    .text(title);

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  // return svg.node();
}

export default function Home(props: HomePropsT) {
  useEffect(() => {
    BarChart(data, {
      x: (d: any) => d.letter,
      y: (d: any) => d.frequency,
      xDomain: d3.groupSort(data, ([d]: any) => -d.frequency, (d: any) => d.letter), // sort by descending frequency
      yFormat: "%",
      yLabel: "↑ Frequency",
      color: "steelblue"
    })
  }, [])

  return (
    <>
      <Head>
        <title>WGS - Leniolabs aca no pasa nada</title>
      </Head>
      <main>
        <svg id='bar-chart'></svg>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const dataSet = await getProcessedDataSet();
  return {
    props: {
      dataSet,
    }
  }
}
