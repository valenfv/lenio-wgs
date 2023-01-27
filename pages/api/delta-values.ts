/* eslint-disable no-case-declarations */
/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next';
import { CountriesDataKeys, IndicatorsKeys } from '../../interfaces';
import iso_countries from '../../data/iso_country.json';
import indicators from '../../data/indicators.json';
import {
  getIndicatorValue, getRankingPosition, rankingSort, round2Decimals,
} from '../../utils/rankingUtils';

function getDeltaValues(comparing_country: CountriesDataKeys): any {
  const deltaValues: any = {};
  const indicatorsKeys = Object.keys(indicators) as Array<IndicatorsKeys>;

  indicatorsKeys.forEach((indicator_key: IndicatorsKeys) => {
    const currentYearIndicatorValues = getIndicatorValue(comparing_country, indicator_key);
    const lastYearIndicatorValues = getIndicatorValue(comparing_country, indicator_key, 1);

    if (currentYearIndicatorValues) {
      deltaValues[indicator_key] = {
        values: [
          {
            year: lastYearIndicatorValues?.year || null,
            value: lastYearIndicatorValues?.value || null,
          },
          {
            year: currentYearIndicatorValues.year,
            value: currentYearIndicatorValues.value,
          },
        ],
        delta: lastYearIndicatorValues
          ? round2Decimals(currentYearIndicatorValues.value - lastYearIndicatorValues.value)
          : null,
      };
    } else {
      deltaValues[indicator_key] = null;
    }
    let sortedCountries: any = [];
    const countries_iso = Object.keys(iso_countries) as Array<CountriesDataKeys>;

    countries_iso.forEach((iso_country_code: CountriesDataKeys) => {
      const indicatorValue = getIndicatorValue(iso_country_code, indicator_key);
      sortedCountries.push({ ...indicatorValue, country: iso_country_code });
    });

    sortedCountries = rankingSort(sortedCountries, indicators[indicator_key].higher_is_better);
    if (deltaValues[indicator_key]) {
      deltaValues[indicator_key].ranking = getRankingPosition(sortedCountries, comparing_country);
      deltaValues[indicator_key].higher_is_better = indicators[indicator_key].higher_is_better;
    }
  });

  return deltaValues;
}

export default function deltaValuesHandler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { query, method } = req;
  const iso_country_code = query.country as CountriesDataKeys;
  switch (method) {
    case 'GET':
      if (!iso_country_code) {
        res.status(403).end('Wrong format');
        break;
      }
      const deltaValues = getDeltaValues(iso_country_code);
      res.status(200).json(deltaValues);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
