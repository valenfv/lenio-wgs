import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/world.module.css';
import {
  NEIGHBORS, ORGANIZATION, WORLD, COUNTRY,
} from '../components/CountryPicker';
import { ConfigContainer } from '../components/ConfigContainer';
import {
  useChoropleth,
  colors as choroplethColors
} from '../lib/useChoropleth';
import { fetchWorldData } from '../slices/worldSlice';
import bordering from '../data/bordering_countries.json';
import organizations from '../data/organizations.json';
import { Loading } from '../components/Loading';

export default function World() {
  const svgRef = React.useRef(null);
  const dispatch = useDispatch();

  const {
    selectedIndicator,
    worldData,
    selectedCountry,
    comparingCountry,
    loading,
    iHib,
  } = useSelector((store) => ({
    selectedIndicator: store.sidebar.selectedIndicator,
    worldData: store.world.data,
    selectedCountry: store.sidebar.selectedCountry,
    comparingCountry: store.sidebar.comparingCountry,
    loading: store.world.loading,
    iHib: store.world.iHib,
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
    iHib,
  });
  function renderLegend() {
    const colors = !iHib ? choroplethColors : choroplethColors.reverse();
    let colorText = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'];
    colorText = !iHib ? colorText : colorText.reverse();

    return [...colors, '#808080'].map((backgroundColor, index) => (
      <div>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor,
          }}
        />
        <div
          style={{
            marginLeft: '10px',
          }}
        >
          {[...colorText, 'No Data'][index]}
        </div>
      </div>
    ));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <div className={styles.worldContainer}>
      <div className={[styles.floatingMenu]}>
        <ConfigContainer showAxisSelection={false} makeIndicatorListClickable />
      </div>
      <Loading loading={loading} />
      <div className={styles.map} ref={svgRef} />
      <div className={styles.colorPallete}>
        {renderLegend()}
      </div>
    </div>
  );
}
