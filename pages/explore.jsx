import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/explore.module.css';
import commonStyles from '../styles/commons.module.css';
import { ConfigContainer } from '../components/ConfigContainer';
import { useScatterPlot } from '../lib/useScatterPlot';
import DataVisContainer from '../components/DataVisContainer';
import {
  NEIGHBORS, ORGANIZATION, WORLD, COUNTRY,
} from '../components/CountryPicker';
import bordering from '../data/bordering_countries.json';
import organizations from '../data/organizations.json';
import { fetchExploreData } from '../slices/exploreSlice';
import { Loading } from '../components/Loading';

export default function World() {
  const svgRef = React.useRef(null);

  const {
    comparingCountry,
    selectedCountry,
    data,
    selectedXAxis,
    selectedYAxis,
    indicatorX,
    indicatorY,
    loading,
  } = useSelector((state) => ({
    comparingCountry: state.sidebar.comparingCountry,
    selectedCountry: state.sidebar.selectedCountry,
    data: state.explore.data,
    selectedXAxis: state.sidebar.xAxis,
    selectedYAxis: state.sidebar.yAxis,
    indicatorX: state.explore.indicatorX,
    indicatorY: state.explore.indicatorY,
    loading: state.explore.loading,
  }));

  const dispatch = useDispatch();

  const highlights = React.useMemo(() => {
    if (selectedCountry?.code === NEIGHBORS) {
      return bordering[comparingCountry?.code];
    } if (selectedCountry?.code === WORLD || selectedCountry?.code === COUNTRY) {
      return null;
    } if (selectedCountry?.group === ORGANIZATION) {
      return organizations?.[selectedCountry?.code];
    }
    return [];
  }, [comparingCountry, selectedCountry]);

  React.useEffect(() => {
    dispatch(fetchExploreData({ xAxis: selectedXAxis, yAxis: selectedYAxis }));
  }, [selectedXAxis, selectedYAxis]);

  useScatterPlot({
    svgRef, data, highlights, indicatorX, indicatorY, comparingCountry,
  });

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.menu}>
        <ConfigContainer showAxisSelection />
      </div>
      <DataVisContainer>
        <Loading loading={loading} />
        <div className={styles.content}>
          <div ref={svgRef} className={styles.chart} />
          <div className={styles.legends}>
            <div className={styles.legend}>
              <svg viewBox="-5 -5 10 10" width={10} height={10}>
                <circle r="5" style={{ fill: 'rgb(105, 179, 162)' }} />
              </svg>
              Countries from
              {' '}
              {selectedCountry.label || ''}
            </div>
            <div className={styles.legend}>
              <svg viewBox="-6 -6 12 12" width={12} height={12}>
                <circle r="5" style={{ fill: 'rgb(0, 0, 0)', opacity: '0.5' }} stroke="rgb(255, 255, 255)" />
              </svg>
              All other countries
            </div>
            <div className={styles.legend}>
              <svg viewBox="0 0 12 12" width={12} height={12}>
                <rect width="8" height="8" x={4} y={-4} style={{ fill: 'rgb(105, 179, 162)', transform: 'rotate(45deg)' }} stroke="rgba(0, 0, 0, 0)" />
              </svg>
              {comparingCountry.label || ''}
            </div>
          </div>
        </div>
      </DataVisContainer>
    </div>
  );
}
