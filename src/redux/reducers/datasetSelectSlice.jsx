import {createSlice} from '@reduxjs/toolkit'
import {fetchOptions} from "../fetchSliceOptions";

export const datasetSelectSlice = createSlice(fetchOptions("select"))

export const {loading, ready, failed} = datasetSelectSlice.actions
export default datasetSelectSlice.reducer