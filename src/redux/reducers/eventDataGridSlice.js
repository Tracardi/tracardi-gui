import {createSlice} from '@reduxjs/toolkit'
import {fetchOptions} from "../fetchSliceOptions";

export const eventDataGridSlice = createSlice(fetchOptions("event-data-grid"))

export const {loading, ready, failed} = eventDataGridSlice.actions
export default eventDataGridSlice.reducer