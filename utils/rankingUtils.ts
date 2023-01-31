import countriesDataJson from '../data/data.json';
import {
  CountriesData, CountriesDataKeys, CountryRankingData, IndicatorsKeys,
} from '../interfaces';

function sortYears(years: Array<string>) {
  years.sort((a, b) => Number(b) - Number(a));
  return years;
}

export function round2Decimals(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function getRankingPosition(arr: any, comparingCountry: CountriesDataKeys) {
  const idx = arr.findIndex((metric: CountryRankingData) => metric.country === comparingCountry);
  return idx + 1;
}

export function rankingSort(arr: any, isHigherBetter: boolean) {
  const arrCopy = [...arr];
  if (isHigherBetter) {
    arrCopy.sort((a: CountryRankingData, b: CountryRankingData) => {
      if (!a || !a.value) return 1;
      if (!b || !b.value) return -1;
      return b.value - a.value;
    });
  } else {
    arrCopy.sort((a: CountryRankingData, b: CountryRankingData) => {
      if (!a || !a.value) return 1;
      if (!b || !b.value) return -1;
      return a.value - b.value;
    });
  }
  return arrCopy;
}

export function getIndicatorValue(
  country: CountriesDataKeys,
  indicator: IndicatorsKeys,
  yearPos = 0,
) {
  const countryIndicators = (countriesDataJson as CountriesData)[country]?.indicators?.[indicator];
  if (!countryIndicators) return null;
  const selectedYear = sortYears(Object.keys(countryIndicators))[yearPos];
  if (selectedYear) {
    const value = (countriesDataJson as CountriesData)[country].indicators[indicator][selectedYear];
    return {
      value,
      year: selectedYear,
    };
  }

  return null;
}
