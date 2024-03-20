import {createSlice} from '@reduxjs/toolkit'

export const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        message: "n/a",
        type: "info",
        show: false,
        hideAfter: 1000
    },
    reducers: {
        showAlert: (state, action) => {
            state.message = action.payload.message
            state.type = action.payload.type
            state.show = true
            state.hideAfter = typeof(action.payload.hideAfter) != "undefined" ? action.payload.hideAfter : 500
        },
        hideAlert: (state) => {
            state.show = false
        }
    }
})

export const {showAlert, hideAlert} = alertSlice.actions
export default alertSlice.reducer