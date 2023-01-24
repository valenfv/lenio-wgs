import countries_data from "../data/data.json";
import iso_countries from "../data/iso_country.json";
import indicators from "../data/indicators.json";

export type CountriesDataKeys = keyof typeof countries_data;

export type IndicatorsKeys = keyof typeof indicators;

export type CountriesNames = typeof iso_countries[CountriesDataKeys];

export type CountriesData = {
	[Property in keyof typeof countries_data]: any;
};

export interface CountryRankingData {
	country: CountriesDataKeys;
	country_name: CountriesNames;
	value: number;
}

export interface RankingMetric {
	indicator: IndicatorsKeys;
	ranking: number;
	sortedCountries: Array<CountryRankingData>;
}

export interface Ranking {
	comparing_country: string;
	metrics: Array<RankingMetric>;
}
