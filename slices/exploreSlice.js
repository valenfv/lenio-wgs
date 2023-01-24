import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


import indicators from '../data/indicators.json';
import countries from '../data/iso_country.json';
import axios from 'axios';


export const generateData = (indicatorX, indicatorY) => {
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    return Object.keys(countries).map((country) => {
        return ({
            isoCc: country,
            [indicatorX.id]: randomIntFromInterval(indicatorX.min, indicatorX.max),
            [indicatorY.id]: randomIntFromInterval(indicatorY.min, indicatorY.max),
        })
    });
}

export const fetchExploreData = createAsyncThunk(
    'explore/fetchExploreData',
    async ({ xAxis, yAxis }) => {
        const { data } = await axios.post('/lenio-wgs/api/indicators-values', {
            indicators: [xAxis, yAxis]
        });

        const filteredData = data.filter(d => d[xAxis] && d[yAxis]).map(d => ({ ...d, isoCc: d.country }))

        const {
            xMin, xMax,
            yMin, yMax
        } = {
            xMin: Math.min.apply(Math, filteredData.map(d => d[xAxis])),
            xMax: Math.max.apply(Math, filteredData.map(d => d[xAxis])),
            yMin: Math.min.apply(Math, filteredData.map(d => d[yAxis])),
            yMax: Math.max.apply(Math, filteredData.map(d => d[yAxis])),
        };

        const indicatorX = {
            id: xAxis,
            indicator_name: indicators[xAxis].indicator_name,
            min: xMin,
            max: xMax,
        };
        const indicatorY = {
            id: yAxis,
            indicator_name: indicators[yAxis].indicator_name,
            min: yMin,
            max: yMax,
        }

        console.log({ filteredData })
        return { data: filteredData, indicatorX, indicatorY };
    });

export const exploreSlice = createSlice({
    name: 'explore',
    initialState: {
        data: null,
        loading: false,
        indicatorX: null,
        indicatorY: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchExploreData.pending, (state) => {
            // just an example
            state.loading = true;
        })
        builder.addCase(fetchExploreData.fulfilled, (state, action) => {
            console.log()
            // just an example
            state.data = action.payload.data;
            state.indicatorX = action.payload.indicatorX;
            state.indicatorY = action.payload.indicatorY;
            state.loading = false;
        })
    },
})

export default exploreSlice.reducer;