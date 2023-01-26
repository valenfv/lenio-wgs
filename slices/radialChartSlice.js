import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LABELS_MAP } from '../constants/radialChart';

export const radialChartSlice = createSlice({
    name: 'radialChart',
    initialState: {
        comparing_country: '',
        metrics: null,
        selectedIndicatorData: null,
    },
    reducers: {
        getRadialChartData: (state, action) => {
            state.comparing_country = action.payload.comparing_country
            state.metrics = action.payload.metrics;
            state.selectedIndicatorData = action.payload.selectedIndicatorData
        },
    },
})

export default radialChartSlice.reducer;

export const {
    getRadialChartData,
} = radialChartSlice.actions;
