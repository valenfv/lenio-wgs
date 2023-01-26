/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const radialChartSlice = createSlice({
  name: 'radialChart',
  initialState: {
    comparing_country: '',
    metrics: null,
    selectedIndicator: 'GINI INDEX',
    selectedIndicatorData: null,
  },
  reducers: {
    getSelectedIndicator: (state, action) => {
      state.selectedIndicator = action.payload;
    },
    getRadialChartData: (state, action) => {
      state.comparing_country = action.payload.comparing_country;
      state.metrics = action.payload.metrics;
      state.selectedIndicatorData = action.payload.selectedIndicatorData;
    },
  },
});

export default radialChartSlice.reducer;

export const {
  getSelectedIndicator,
  getRadialChartData,
} = radialChartSlice.actions;
