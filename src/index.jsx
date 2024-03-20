import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {createRoot} from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'
import {Provider} from "react-redux";
import App from "./components/App";
import {stagingTheme} from "./themes";
import {ThemeProvider, StyledEngineProvider} from "@mui/material/styles";
import {ConfirmProvider} from "material-ui-confirm";
import ApiUrlSelector from "./components/ApiUrlSelector";

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
                            <App/>
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
