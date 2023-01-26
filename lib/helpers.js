import { LABELS_MAP, INDICATORS_QTY } from "../constants/radialChart";
import countries from '../data/countries.json';

export const capitalizeFirstLetter = (string) =>  string.charAt(0).toUpperCase() + string.slice(1);

export const setEllipsis = (label, visibleLength) => {
  let indicator = label
  if (label.length > visibleLength) {
    indicator = `${label.split('').splice(0, visibleLength).join('')}...`;
  }
  return indicator;
};

export const formatRadialChartData = (response, indicator, width, height, valueScale) => {
  const { comparing_country, metrics } = response;
  const eachAngle = (2 * Math.PI) / INDICATORS_QTY;
  const formattedMetrics = [];

  metrics.forEach(metric => {
    const formattedMetric = {...metric};
    formattedMetric.type = LABELS_MAP[formattedMetric.indicator].type;
    formattedMetrics.push(formattedMetric);
  });

  formattedMetrics.sort((a, b) => {
    if(a.type < b.type) { return -1; }
    if(a.type > b.type) { return 1; }
    return 0;
  });

  const selectedIndicatorData = formattedMetrics.filter(metric => metric.indicator === indicator)[0];

  formattedMetrics?.forEach((d, i) => {
    d.startAngle = i * eachAngle;
    d.endAngle = (i + 1) * eachAngle;
    const zeroRadius = valueScale(0);
    if (d.ranking > 0) {
      d.innerRadius = zeroRadius;
      d.outerRadius = valueScale(d.ranking);
    } else {
      d.innerRadius = valueScale(d.ranking);
      d.outerRadius = zeroRadius;
    }
  });

  return {
    comparing_country,
    metrics: formattedMetrics,
    selectedIndicatorData
  }
}

export const getRadialChartLabes = (metrics) => {
  const chartLabels = [];

  metrics?.forEach(metric => {
    chartLabels.push(LABELS_MAP[metric.indicator].label)
  })

  return chartLabels;
};

export const getIndicatorsTypemap = () => {
  const indicatorsTypeMap = {}

  Object.values(LABELS_MAP).forEach(indicator => indicatorsTypeMap[indicator.label] = indicator.type);

  return indicatorsTypeMap;
}

export const generateRadialChartMockData = (maxScore) => {
  const mockData = [];
  let testValue= maxScore;
  Object.keys(countries).forEach((country, index) => {
    if (index < 40) {
      mockData.push({
        country,
        value: testValue
      })
      testValue--;
      if (testValue < 1) testValue = 26
    }
  });
  return mockData;
}