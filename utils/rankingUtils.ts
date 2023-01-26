import countries_data from "../data/data.json";
import { CountriesData, CountriesDataKeys, CountryRankingData, IndicatorsKeys } from "../interfaces";

function sortYears(years: Array<string>) {
	years.sort((a, b) => Number(b) - Number(a));
	return years;
}

export function round2Decimals(num: number) {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function getRankingPosition(arr: any, comparing_country: CountriesDataKeys) {
	const idx = arr.findIndex((metric: CountryRankingData) => metric.country === comparing_country);
	return idx + 1;
}

export function rankingSort(arr: any, isHigherBetter: boolean) {
	const arrCopy = [...arr];
	if (isHigherBetter) {
		arrCopy.sort((a: CountryRankingData, b: CountryRankingData) => b?.value - a?.value);
	} else {
		arrCopy.sort((a: CountryRankingData, b: CountryRankingData) => a?.value - b?.value);
	}
	return [...arrCopy];
}

export function getIndicatorValue(country: CountriesDataKeys, indicator: IndicatorsKeys, year_pos = 0) {
	const country_indicators = (countries_data as CountriesData)[country]?.indicators?.[indicator];
	if (!country_indicators) return null;
	const selected_year = sortYears(Object.keys(country_indicators))[year_pos];
	if (selected_year) {
		const value = (countries_data as CountriesData)[country].indicators[indicator][selected_year];
		return {
			value,
			year: selected_year,
		};
	}

	return null;
}
