import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/world.module.css';
import {
  NEIGHBORS, ORGANIZATION, WORLD, COUNTRY,
} from '../components/CountryPicker';
import { ConfigContainer } from '../components/ConfigContainer';
import {
  useChoropleth,
} from '../lib/useChoropleth';
import { fetchWorldData } from '../slices/worldSlice';
import bordering from '../data/bordering_countries.json';
import organizations from '../data/organizations.json';

export default function World() {
  const svgRef = React.useRef(null);
  const dispatch = useDispatch();

  const {
    selectedIndicator,
    worldData,
    selectedCountry,
    comparingCountry,
  } = useSelector((store) => ({
    selectedIndicator: store.sidebar.selectedIndicator,
    worldData: store.world.data,
    selectedCountry: store.sidebar.selectedCountry,
    comparingCountry: store.sidebar.comparingCountry,
  }));

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
    dispatch(fetchWorldData(selectedIndicator));
  }, [selectedIndicator]);

  useChoropleth(svgRef, {
    worldData,
    selectedIndicator,
    highlights,
    comparingCountry,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <div className={styles.worldContainer}>
      <div className={[styles.floatingMenu]}>
        <ConfigContainer showAxisSelection={false} makeIndicatorListClickable />
      </div>
      <div className={styles.map} ref={svgRef} />
    </div>
  );
}
