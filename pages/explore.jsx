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
        <div ref={svgRef} className={styles.chart} />

      </DataVisContainer>
    </div>
  );
}
