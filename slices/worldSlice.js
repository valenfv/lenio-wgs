import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const fetchWorldData = createAsyncThunk(
    'world/fetchWorldData',
    async (indicator) => {
        const { data } = await axios.post('/lenio-wgs/api/indicators-values', {
            indicators: [indicator]
        });
        const serializedData = data.filter(d => d[indicator]).reduce((prev, curr) => ({
            ...prev,
            [curr.country]: { ...curr }
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