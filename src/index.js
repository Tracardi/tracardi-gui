import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'
import {Provider} from "react-redux";
import App from "./components/App";
import {stagingTheme, productionTheme} from "./themes";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import {ConfirmProvider} from "material-ui-confirm";
import Installer from "./components/Installer";
import ApiUrlSelector from "./components/ApiUrlSelector";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: "https://2721a09bf1144c10930117609a67f4d5@o1093519.ingest.sentry.io/6112822",
        integrations: [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={stagingTheme}>
                    <CssBaseline/>
                    <ConfirmProvider>
                        <ApiUrlSelector>
                            <Installer>
                                <App/>
                            </Installer>
                        </ApiUrlSelector>
                    </ConfirmProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
