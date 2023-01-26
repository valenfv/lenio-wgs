/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import { LABELS_MAP, INDICATORS_QTY } from '../constants/radialChart';
import countries from '../data/countries.json';
import borderingCountries from '../data/bordering_countries.json';
import organizations from '../data/organizations.json';
import indicators from '../data/indicators.json';

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const setEllipsis = (label, visibleLength) => {
  let indicator = label;
  if (label.length > visibleLength) {
    indicator = `${label.split('').splice(0, visibleLength).join('')}...`;
  }
  return indicator;
};

export const formatRadialChartData = (response) => {
  const { comparing_country, metrics } = response;
  const formattedMetrics = [];

  metrics.forEach(metric => {
    const formattedMetric = {...metric};
    const indicatorName = indicators[formattedMetric.indicator]?.indicator_name;
    formattedMetric.indicator = indicatorName;
    formattedMetric.type = LABELS_MAP[formattedMetric.indicator].type;
    formattedMetrics.push(formattedMetric);
  });

  formattedMetrics.sort((a, b) => {
    if (a.type < b.type) { return -1; }
    if (a.type > b.type) { return 1; }
    return 0;
  });

  return {
    comparing_country,
    metrics: formattedMetrics,
  }
}

export const getRadialChartLabes = (metrics) => {
  const chartLabels = [];

  metrics?.forEach(metric => {
    chartLabels.push(LABELS_MAP[metric.indicator]?.label)
  })

  return chartLabels;
};

export const getIndicatorsTypemap = () => {
  const indicatorsTypeMap = {};

  Object.values(LABELS_MAP).forEach((indicator) => indicatorsTypeMap[indicator.label] = indicator.type);

  return indicatorsTypeMap;
};

export const generateRadialChartMockData = (topScore) => {
  const mockData = [];
  let testValue = topScore;
  Object.keys(countries).forEach((country, index) => {
    if (index < 40) {
      mockData.push({
        country,
        value: testValue,
      });
      testValue--;
      if (testValue < 1) testValue = 26;
    }
  });
  return mockData;
};

export const getCountries = (country, selectedCountries) => {
  if (selectedCountries === 'NEIGHBORS') return borderingCountries[country];
  if (selectedCountries === 'WORLD') return countries.map(country => country['alpha-3']);
  return organizations[selectedCountries]
}
