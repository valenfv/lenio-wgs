import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const radialChartSlice = createSlice({
    name: 'radialChart',
    initialState: {
        data: null,
    },
    reducers: {
        getRadialChartData: (state, action) => {
            state.data = action.payload;
        },
    },
})

export default radialChartSlice.reducer;

export const {
    getRadialChartData,
} = radialChartSlice.actions;
