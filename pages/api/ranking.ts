/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  Ranking, RankingMetric, CountriesDataKeys, IndicatorsKeys,
} from '../../interfaces';
import iso_countries from '../../data/iso_country.json';
import indicators from '../../data/indicators.json';
import { getIndicatorValue, getRankingPosition, rankingSort } from '../../utils/rankingUtils';

function getRankings(comparing_country: CountriesDataKeys, countries: Array<CountriesDataKeys>): Ranking {
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
      const countryIndicatorValue = getIndicatorValue(iso_country_code, indicator_key);
      obj.sortedCountries.push({
        country: iso_country_code,
        country_name: iso_countries[iso_country_code],
        value: countryIndicatorValue?.value || null,
      });
    });

    obj.sortedCountries = rankingSort(obj.sortedCountries, indicators[indicator_key].higher_is_better);
    obj.ranking = getRankingPosition(obj.sortedCountries, comparing_country);
    rankings.metrics.push(obj);
  });

  return rankings;
}

export default function rankingHandler(req: NextApiRequest, res: NextApiResponse<Ranking>) {
  const { body, method } = req;
  const { comparing_country } = body;
  const { selected_countries } = body;
  switch (method) {
    case 'POST':
      if (!comparing_country || !selected_countries) {
        res.status(403).end('Wrong format');
        break;
      }
      const rankings = getRankings(comparing_country, [comparing_country, ...selected_countries]);
      res.status(200).json(rankings);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
