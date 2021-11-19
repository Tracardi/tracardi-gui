import { createSlice } from '@reduxjs/toolkit';

export const iconSlice = createSlice({
  name: 'icon',
  initialState: {
    icon: null,
  },
  reducers: {
    addIcon: (state, action) => {
      state.icon = action.payload;
    },
  },
});

export const { addIcon } = iconSlice.actions;
export default iconSlice.reducer;
