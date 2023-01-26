import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const fetchWorldData = createAsyncThunk(
    'world/fetchWorldData',
    async (indicator) => {
        const { data } = await axios.post('/lenio-wgs/api/indicators-values', {
            indicators: [indicator]
        });
        const iHib = data.find(countryData => Boolean(countryData[indicator]))[indicator].higher_is_better;
        const rankedData = data.filter(d => d[indicator])
            .sort((a, b) =>
                iHib ?
                    a[indicator].value - b[indicator].value
                    : b[indicator].value - a[indicator].value);
        const serializedData = rankedData.reduce((prev, curr, index) => ({
            ...prev,
            [curr.country]: {
                ...curr,
                position: index + 1,
            }
        }), {});
        return serializedData;
    }
);

export const worldSlice = createSlice({
    name: 'world',
    initialState: {
        data: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWorldData.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})

export default worldSlice.reducer;