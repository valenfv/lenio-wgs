import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


import indicators from '../data/indicators.json';
import countries from '../data/iso_country.json';
import bordering from '../data/bordering_countries.json';

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
    async ({ indicatorX, indicatorY }) => {
        return new Promise((res) => {
            setTimeout(() => {
                res(generateData(indicatorX, indicatorY));
            }, 1000)
        });
    });

export const exploreSlice = createSlice({
    name: 'explore',
    initialState: {
        data: null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchExploreData.pending, (state) => {
            // just an example
            state.loading = true;
        })
        builder.addCase(fetchExploreData.fulfilled, (state, action) => {
            // just an example
            state.data = action.payload;
            state.loading = false;
        })
    },
})

export default exploreSlice.reducer;