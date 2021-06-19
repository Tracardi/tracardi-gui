import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'
import {Provider} from "react-redux";
import App from "./components/App";
import {mainTheme} from "./themes";
import {ThemeProvider} from "@material-ui/core/styles";
import {ConfirmProvider} from "material-ui-confirm";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>

            <ThemeProvider theme={mainTheme}>
                <CssBaseline/>
                <ConfirmProvider>
                <App/>
                </ConfirmProvider>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.querySelector('#root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
