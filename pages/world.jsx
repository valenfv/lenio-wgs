import React from "react";
import styles from "../styles/world.module.css";
import commonStyles from "../styles/commons.module.css";
import { ConfigContainer } from "../components/ConfigContainer";
import {
  CHOROPLEITH_HEIGHT,
  CHOROPLEITH_WIDTH,
  useChoropleth,
} from "../lib/useChoropleth";

export default function World() {
  const svgRef = React.useRef(null);
  useChoropleth(svgRef);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <div className={styles.worldContainer}>
      <div className={[styles.floatingMenu]}>
        <ConfigContainer />
      </div>
      <div className={styles.map}>
        <svg
          viewBox={`0 0 ${CHOROPLEITH_WIDTH} ${CHOROPLEITH_HEIGHT}`}
          className={styles.svg}
          ref={svgRef}
        />
      </div>
    </div>
  );
}
