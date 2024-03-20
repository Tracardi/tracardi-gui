import {createSlice} from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        value: 0
    },
    reducers: {
        increaseNotificationNumber: state => {
            state.value += 1
        },
        decreaseNotificationNumber: state => {
            state.value -= 1
        },
        resetNotificationNumber: state => {
            state.value = 0
        }
    }
})

export const {
    increaseNotificationNumber,
    decreaseNotificationNumber,
    resetNotificationNumber} = notificationSlice.actions
export default notificationSlice.reducer