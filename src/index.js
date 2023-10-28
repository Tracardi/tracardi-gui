import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'
import {Provider} from "react-redux";
import App from "./components/App";
import {stagingTheme} from "./themes";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import {ConfirmProvider} from "material-ui-confirm";
import ApiUrlSelector from "./components/ApiUrlSelector";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import KeyCloakAuthProvider from "./components/context/KeyCloakContext";

if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: "https://2721a09bf1144c10930117609a67f4d5@o1093519.ingest.sentry.io/6112822",
        integrations: [new Integrations.BrowserTracing(), new Sentry.Replay()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,
        // If the entire session is not sampled, use the below sample rate to sample
        // sessions when an error occurs.
        replaysOnErrorSampleRate: 1.0
    });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
        <Provider store={store}>
            <KeyCloakAuthProvider enabled={true}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={stagingTheme}>
                        <CssBaseline/>
                        <ConfirmProvider>
                            <ApiUrlSelector>
                                <App/>
                            </ApiUrlSelector>
                        </ConfirmProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </KeyCloakAuthProvider>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
