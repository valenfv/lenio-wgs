import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const changeComparingCountry = createAsyncThunk(
    'sidebar/changeComparingCountry',
    async (country) => {
        return new Promise((res) => {
            setTimeout(() => {
                res(country);
            }, 0)
        });
    });

export const sidebarSlice = createSlice({
    name: 'counter',
    initialState: {
        comparingCountry: 'USA',
        selectedCountry: 'WORLD',
    },
    extraReducers: (builder) => {
        builder.addCase(changeComparingCountry.fulfilled, (state, action) => {
            state.comparingCountry = action.payload;
        })
    },
})

export default sidebarSlice.reducer;