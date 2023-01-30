/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWorldData = createAsyncThunk(
  'world/fetchWorldData',
  async (indicator) => {
    const { data } = await axios.post('/lenio-wgs/api/indicators-values', {
      indicators: [indicator],
    });
    // eslint-disable-next-line max-len
    const iHib = data.find((countryData) => Boolean(countryData[indicator]))[indicator].higher_is_better;
    const rankedData = data.filter((d) => d[indicator])
      .sort((a, b) => (iHib
        ? a[indicator].value - b[indicator].value
        : b[indicator].value - a[indicator].value));
    const serializedData = rankedData.reduce((prev, curr, index) => ({
      ...prev,
      [curr.country]: {
        ...curr,
        position: index + 1,
      },
    }), {});
    return serializedData;
  },
);

export const worldSlice = createSlice({
  name: 'world',
  initialState: {
    data: null,
    loading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorldData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWorldData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
  },
});

export default worldSlice.reducer;
