import {createSlice} from '@reduxjs/toolkit'

export const pagingSlice = createSlice({
    name: 'paging',
    initialState: {
        page: 0,
        shown: 0,
        total: 0,
        type: '',
        refreshOn: false
    },
    reducers: {
        increasePage: (state, action) => {
            state.page = state.page + 1;
        },
        resetPage: (state, action) => {
            state.page = 0;
            state.shown = 0;
            state.total = 0;
            state.type = action.payload.type
        },
        setRefreshOn: (state) => {
            state.refreshOn = true;
        },
        setRefreshOff: (state) => {
            state.refreshOn = false;
        },
        updateCounts: (state, action) => {
            state.total = action.payload.total;
            state.shown = state.shown + action.payload.shown;
        }
    }
})

export const {increasePage, resetPage, updateCounts, setRefreshOn, setRefreshOff} = pagingSlice.actions
export default pagingSlice.reducer