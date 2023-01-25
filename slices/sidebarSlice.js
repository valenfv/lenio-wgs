import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const changeComparingCountryAsyncExample = createAsyncThunk(
    'sidebar/changeComparingCountry',
    async (country) => {
        return new Promise((res) => {
            setTimeout(() => {
                res(country);
            }, 0)
        });
    });

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        comparingCountry: null,
        selectedCountry: null,
        xAxis: 'abf6788a66fbe940547ee9c108535f0be5b0eacbd2bec3796634f90a742202cd', // gini
        yAxis: '80c1e29026bae838ab3275c67aed5010b25cc6c12cc109a75a4695a9c9735c56', // happy planet index
    },
    reducers: {
        changeComparingCountry: (state, action) => {
            state.comparingCountry = action.payload;
        },
        changeSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload;
        },
        changeAxis: (state, action) => {
            state.xAxis = action.payload.x;
            state.yAxis = action.payload.y;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(changeComparingCountryAsyncExample.fulfilled, (state, action) => {
            // just an example
            state.comparingCountry = action.payload;
        })
    },
})

export default sidebarSlice.reducer;

export const {
    changeComparingCountry,
    changeSelectedCountry,
    changeAxis,
} = sidebarSlice.actions;