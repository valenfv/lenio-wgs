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
        const indicatorX = {
            id: xAxis,
            indicator_name: indicators[xAxis].indicator_name,
            min: 0,
            max: 100,
        };
        const indicatorY = {
            id: yAxis,
            indicator_name: indicators[yAxis].indicator_name,
            min: 200,
            max: 1500,
        }

        axios.post('/lenio-wgs/api/indicators-values', {
            indicators: [xAxis, yAxis]
        }).then(response => console.log({ response })).catch(x => console.log({ x }))


        return new Promise((res) => {
            setTimeout(() => {
                const data = generateData(indicatorX, indicatorY);
                res({ data, indicatorX, indicatorY });
            }, 1000)
        });
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
            // just an example
            state.data = action.payload.data;
            state.indicatorX = action.payload.indicatorX;
            state.indicatorY = action.payload.indicatorY;
            state.loading = false;
        })
    },
})

export default exploreSlice.reducer;