import React from "react";
import styles from "../styles/world.module.css";
import commonStyles from "../styles/commons.module.css";
import { ConfigContainer } from "../components/ConfigContainer";
import {
  CHOROPLEITH_HEIGHT,
  CHOROPLEITH_WIDTH,
  useChoropleth,
} from "../lib/useChoropleth";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorldData } from "../slices/worldSlice";

export default function World() {
  const svgRef = React.useRef(null);
  const dispatch = useDispatch();

  const { selectedIndicator, worldData }= useSelector((store) => ({
    selectedIndicator: store.sidebar.selectedIndicator,
    worldData: store.world.data,
  }));


  React.useEffect(() => {
    dispatch(fetchWorldData(selectedIndicator))
  }, [selectedIndicator])

  useChoropleth(svgRef, {
    worldData,
    selectedIndicator
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <div className={styles.worldContainer}>
      <div className={[styles.floatingMenu]}>
        <ConfigContainer showAxisSelection={false} makeIndicatorListClickable={true}/>
      </div>
      <div className={styles.map} ref={svgRef}>
      </div>
    </div>
  );
}
