import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatRadialChartData } from '../lib/helpers';
import axios from 'axios';

export const fetchRankingData = createAsyncThunk(
    'radialChart/fetchRankingData',
    async ({ comparing_country, selected_countries }) => {
        const { data } = await axios.post('/lenio-wgs/api/ranking', {
            comparing_country,
            selected_countries
        });
        return formatRadialChartData(data) ;
    }
);

export const radialChartSlice = createSlice({
    name: 'radialChart',
    initialState: {
        comparing_country: '',
        metrics: null,
        selectedIndicator: "GINI INDEX",
        test: null
    },
    reducers: {
        getSelectedIndicator: (state, action) => {
            state.selectedIndicator = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRankingData.fulfilled, (state, action) => {
            state.comparing_country = action.payload.comparing_country,
            state.metrics = action.payload.metrics
        })
    },
})

export default radialChartSlice.reducer;

export const {
    getSelectedIndicator,
} = radialChartSlice.actions;
