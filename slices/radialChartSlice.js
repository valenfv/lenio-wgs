/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { formatRadialChartData } from '../lib/helpers';

export const fetchRankingData = createAsyncThunk(
  'radialChart/fetchRankingData',
  async ({ comparing_country, selected_countries }) => {
    const { data } = await axios.post('/lenio-wgs/api/ranking', {
      comparing_country,
      selected_countries,
    });
    return formatRadialChartData(data);
  },
);

export const radialChartSlice = createSlice({
  name: 'radialChart',
  initialState: {
    comparing_country: '',
    metrics: null,
    selectedIndicator: 'abf6788a66fbe940547ee9c108535f0be5b0eacbd2bec3796634f90a742202cd',
    test: null,
  },
  reducers: {
    setSelectedIndicator: (state, action) => {
      state.selectedIndicator = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRankingData.fulfilled, (state, action) => {
      state.comparing_country = action.payload.comparing_country;
      state.metrics = action.payload.metrics;
    });
  },
});

export default radialChartSlice.reducer;

export const {
  setSelectedIndicator,
} = radialChartSlice.actions;
