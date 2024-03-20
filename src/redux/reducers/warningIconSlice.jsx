import {createSlice} from '@reduxjs/toolkit'

export const warningIconSlice = createSlice({
    name: 'warning',
    initialState: {
        show: false,
        message: "n/a"
    },
    reducers: {
        showWarningIcon: (state, action) => {
            state.show = true
            state.message = action.payload.message
        },
        hideWarningIcon: state => {
            state.show = false
            state.message = ''
        }
    }
})

export const {showWarningIcon, hideWarningIcon} = warningIconSlice.actions
export default warningIconSlice.reducer