import type { NextApiRequest, NextApiResponse } from "next";
import { CountriesDataKeys, IndicatorsKeys, IndicatorValue } from "../../interfaces";
import iso_countries from "../../data/iso_country.json";
import { getLatestIndicatorValue } from "../../utils/rankingUtils";

function getIndicatorsValues(indicators: Array<IndicatorsKeys>): Array<IndicatorValue> {
	const indicatorsValues: Array<IndicatorValue> = [];

	const countries = Object.keys(iso_countries) as Array<CountriesDataKeys>;

	countries.forEach((iso_country_code: CountriesDataKeys) => {
		const temp: any = {
			country: iso_country_code,
		};
		indicators.forEach((indicator_key: IndicatorsKeys) => {
			const value = getLatestIndicatorValue(iso_country_code, indicator_key);
			if (value) {
				temp[indicator_key] = value;
			}
		});

		indicatorsValues.push(temp);
	});

	return indicatorsValues;
}

export default function indicatorsValuesHandler(req: NextApiRequest, res: NextApiResponse<Array<IndicatorValue>>) {
	const { body, method } = req;
	const selected_indicators = body.indicators;
	switch (method) {
		case "POST":
			if (!selected_indicators?.length) {
				res.status(403).end("Wrong format");
				break;
			}
			const indicatorsValues = getIndicatorsValues(selected_indicators);
			res.status(200).json(indicatorsValues);
			break;
		default:
			res.setHeader("Allow", ["POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
