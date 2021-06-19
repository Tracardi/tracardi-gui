import {createSlice} from '@reduxjs/toolkit'

export const progressSlice = createSlice({
    name: 'progress',
    initialState: {
        progress: 0
    },
    reducers: {
        increaseProgress: (state, action) => {
            state.progress += action.payload.value
        },
        decreaseProgress: (state, action) => {
            state.progress -= action.payload.value
        },
        resetProgress: state => {
            state.progress = 0
        }
    }
})

export const {
    increaseProgress,
    decreaseProgress,
    resetProgress} = progressSlice.actions
export default progressSlice.reducer