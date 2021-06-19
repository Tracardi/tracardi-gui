export const fetchOptions = (name) => {
    return {
        name: name,
        initialState: {
            data: [],
            error: null,
            loading: false
        },
        reducers: {
            loading: (state) => {
                state.data = []
                state.loading = true
                state.error = null
            },
            ready: (state, action) => {
                state.data = action.payload.data
                state.loading = false
                state.error = null
            },
            failed: (state, action) => {
                state.data = []
                state.loading = false
                state.error = action.payload.error
            }

        }
    }
}