import type { NextApiRequest, NextApiResponse } from "next";
import {
	Ranking,
	RankingMetric,
	CountriesData,
	CountriesDataKeys,
	CountryRankingData,
	IndicatorsKeys,
} from "../../interfaces";
import iso_countries from "../../data/iso_country.json";
import indicators from "../../data/indicators.json";
import { getLatestIndicatorValue, getLatestYear } from "../../utils/rankingUtils";

function getRankings(comparing_country: string, countries: Array<CountriesDataKeys>): Ranking {
	const rankings: Ranking = {
		comparing_country,
		metrics: [],
	};
	const indicatorsKeys = Object.keys(indicators) as Array<IndicatorsKeys>;

	indicatorsKeys.forEach((indicator_key: IndicatorsKeys) => {
		const obj: RankingMetric = {
			indicator: indicator_key,
			ranking: 0,
			sortedCountries: [],
		};

		countries.forEach((iso_country_code: CountriesDataKeys) => {
			const value = getLatestIndicatorValue(iso_country_code, indicator_key);
			obj.sortedCountries.push({
				country: iso_country_code,
				country_name: iso_countries[iso_country_code],
				value,
			});
		});
		if (true) {
			// higher is better
			obj.sortedCountries.sort((a: CountryRankingData, b: CountryRankingData) => b.value - a.value);
		} else {
			// Lower is better
			obj.sortedCountries.sort((a: CountryRankingData, b: CountryRankingData) => a.value - b.value);
		}

		const idx = obj.sortedCountries.findIndex((metric: CountryRankingData) => metric.country === comparing_country);
		obj.ranking = idx + 1;
		rankings.metrics.push(obj);
	});

	return rankings;
}

export default function rankingHandler(req: NextApiRequest, res: NextApiResponse<Ranking>) {
	const { body, method } = req;
	const comparing_country = body.comparing_country;
	const selected_countries = body.selected_countries;
	switch (method) {
		case "POST":
			if (!comparing_country || !selected_countries?.length) {
				res.status(403).end("Wrong format");
				break;
			}
			const rankings = getRankings(comparing_country, [comparing_country, ...selected_countries]);
			res.status(200).json(rankings);
			break;
		default:
			res.setHeader("Allow", ["POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
