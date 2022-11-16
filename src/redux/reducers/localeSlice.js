import { createSlice } from "@reduxjs/toolkit"

import storageValue from "../../misc/localStorageDriver"

export const locale = createSlice({
  name: "locale",
  initialState: {
    language: new storageValue("tracardi-language").read("en"),
  },
  reducers: {
    changeLanguage: (state,  {payload}) => {
      if (["zh", "en"].includes(payload.language)) {
        state.language = payload.language
        new storageValue("tracardi-language").save(payload.language)
      } else {
        state.language = "en"
        new storageValue("tracardi-language").save("en")
      }
    },
  },
})

export const { changeLanguage } = locale.actions
export default locale.reducer
