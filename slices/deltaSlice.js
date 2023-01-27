/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDeltaData = createAsyncThunk("delta/fetchDeltaData", async (country) => {
	const { data } = await axios.get("/lenio-wgs/api/delta-values", {
		params: {
			country,
		},
	});
	return data;
});

export const deltaSlice = createSlice({
	name: "indicatorsDelta",
	initialState: {
		indicatorsDelta: [],
	},
	reducers: {
		setIndicatorsDelta: (state, action) => {
			state.indicatorsDelta = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchDeltaData.fulfilled, (state, action) => {
			state.indicatorsDelta = action.payload;
		});
	},
});

export default deltaSlice.reducer;

export const { setIndicatorsDelta } = deltaSlice.actions;
