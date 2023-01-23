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
        comparingCountry: 'USA',
        selectedCountry: 'WORLD',
    },
    reducers: {
        changeComparingCountry: (state, action) => {
            state.comparingCountry = action.payload;
        },
        changeSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload;
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

export const { changeComparingCountry, changeSelectedCountry } = sidebarSlice.actions;