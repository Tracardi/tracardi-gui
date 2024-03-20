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
        increasePage: (state) => {
            state.page = state.page + 1;
        },
        resetPage: (state) => {
            state.page = 0;
            state.shown = 0;
            state.total = 0;
        },
        setRefreshOn: (state) => {
            state.refreshOn = true;
        },
        setRefreshOff: (state) => {
            state.refreshOn = false;
        },
        updateCounts: (state, {payload}) => {
            state.total = payload.total;
            state.shown = state.shown + payload.shown;
        },
        setType: (state, {payload}) => {
            state.type = payload.type
        }
    }
})

export const {increasePage, resetPage, updateCounts, setRefreshOn, setRefreshOff, setType} = pagingSlice.actions
export default pagingSlice.reducer