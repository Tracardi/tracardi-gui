import {createSlice} from '@reduxjs/toolkit'

export const newResource = createSlice({
    name: 'new-resource',
    initialState: {
        show: false,
    },
    reducers: {
        open: (state, action) => {
            state.show = true
        },
        close: state => {
            state.show = false
        }
    }
})

export const {open, close} = newResource.actions
export default newResource.reducer