/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWorldData = createAsyncThunk(
  'world/fetchWorldData',
  async (indicator) => {
    const { data } = await axios.post('/api/indicators-values', {
      indicators: [indicator],
    });
    // eslint-disable-next-line max-len
    const iHib = data.find((countryData) => Boolean(countryData[indicator]))[indicator].higher_is_better;
    const rankedData = data.filter((d) => d[indicator])
      .sort((a, b) => (a[indicator].value - b[indicator].value));
    // console.log({ rankedData });
    const serializedData = rankedData.reduce((prev, curr, index) => ({
      ...prev,
      [curr.country]: {
        ...curr,
        position: index + 1,
      },
    }), {});
    return { serializedData, iHib };
  },
);

export const worldSlice = createSlice({
  name: 'world',
  initialState: {
    data: null,
    loading: false,
    iHib: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorldData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWorldData.fulfilled, (state, action) => {
      state.data = action.payload.serializedData;
      state.iHib = action.payload.iHib;
      state.loading = false;
    });
  },
});

export default worldSlice.reducer;
