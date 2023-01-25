import countries_data from "../data/data.json";
import { CountriesData, CountriesDataKeys, IndicatorsKeys } from "../interfaces";

export function getLatestYear(years: Array<string>) {
	years.sort((a, b) => Number(b) - Number(a));
	return years[0];
}

export function getLatestIndicatorValue(country: CountriesDataKeys, indicator: IndicatorsKeys) {
	const country_indicators = (countries_data as CountriesData)[country]?.indicators?.[indicator];
	if (!country_indicators) return null;
	const latestYear = getLatestYear(Object.keys(country_indicators));
	if (latestYear) {
		return (countries_data as CountriesData)[country].indicators[indicator][latestYear];
	}
	return null;
}
