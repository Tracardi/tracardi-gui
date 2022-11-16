import React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";

import { enUS, zhCN } from "@mui/material/locale"
import { createTheme, ThemeProvider } from "@mui/material/styles";

import zh_CN from "./lang/zh_CN";
import en_US from "./lang/en_US";
import { mainTheme } from "../themes";


const flattenMessages = (nestedMessages, prefix = "") => {
  if (nestedMessages === null) {
    return {}
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key]
    const prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "string") {
      Object.assign(messages, { [prefixedKey]: value })
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }

    return messages
  }, {})
}

const chooseLocale = (language) => {
  let _language = language || navigator.language.split("_")[0]
  switch (_language) {
    case "en":
      return en_US
    case "zh":
      return zh_CN
    default:
      return en_US
  }
}

const chooseThemeLocale = (language) => {
  let _language = language || navigator.language.split("_")[0]
  switch (_language) {
    case "en":
      return {...mainTheme, enUS}
    case "zh":
      return {...mainTheme, zhCN}
    default:
      return {...mainTheme, enUS}
  }
}

const mapState = (state) => {
  return {
    locale: state.localeReducer.language,
    localeTheme: chooseThemeLocale(state.localeReducer.language),
    localeMessage: chooseLocale(state.localeReducer.language),
  }
}

const Index = (props) => {
  const { locale, localeTheme, localeMessage, children } = props

  return (
      <IntlProvider locale={locale} messages={flattenMessages(localeMessage)}>
        <ThemeProvider theme={createTheme(localeTheme)}>
          {children}
        </ThemeProvider>
      </IntlProvider>
  )
}

export default connect(mapState)(Index)
