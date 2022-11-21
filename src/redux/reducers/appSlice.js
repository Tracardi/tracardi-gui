import { createSlice } from "@reduxjs/toolkit"


export const appSlice = createSlice({
  name: "app",
  initialState: {
    currentRoute: new URL(window.location.href).pathname,
  },
  reducers: {
    changeRoute: (state, { payload }) => {
      if (payload.route) {
        state.currentRoute = payload.route
      }
    },
  },
})

export const { changeRoute } = appSlice.actions
export default appSlice.reducer
