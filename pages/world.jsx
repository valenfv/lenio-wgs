import React from 'react';
import styles from '../styles/world.module.css';
import { ConfigContainer } from '../components/ConfigContainer';
import { useChoropleth } from '../lib/useChoropleth';

export default function World() {
  const svgRef = React.useRef(null);
  useChoropleth(svgRef)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <div className={styles.worldContainer}>
      <div className={styles.floatingMenu}>
        <ConfigContainer />
      </div>
      <div className={styles.map}>
        <svg className={styles.svg} ref={svgRef} width="1200" height="675" />
      </div>
    </div>
  );
}
