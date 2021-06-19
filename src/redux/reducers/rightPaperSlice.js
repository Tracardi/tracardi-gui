import {createSlice} from '@reduxjs/toolkit'

export const rightPaperSlice = createSlice({
    name: "right-paper",
    initialState: {
        caseId: "",
        open: false,
        width: 1000,
        anchor: "right",
        data: {}
    },
    reducers: {
        openRightPaper: (state, action) => {
            state.caseId = action.payload.caseId
            state.width = action.payload.width
            if (typeof action.payload.data!=="undefined") {
                state.data = action.payload.data
            }
            state.anchor = typeof action.payload.anchor!=="undefined" ? action.payload.anchor : "right"
            state.open = true
        },
        closeRightPaper: (state) => {
            state.open = false
            state.caseId = ""
            state.data = {}
        },
    }
})

export const {openRightPaper, closeRightPaper} = rightPaperSlice.actions
export default rightPaperSlice.reducer