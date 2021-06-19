import {red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

export const mainTheme = createMuiTheme({
    // typography: {
    //     fontFamily: [
    //         'Lato',
    //     ].join(','),
    // },
    palette: {
        primary: {
            main: '#006db3',
        },
        secondary: {
            main: '#EF6C00',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#ccc',
        },
        text: {
            primary: '#000'
        }
    },
});

export const signInTheme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#006db3',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#cF5C00',
            main: '#EF6C00',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
        },
        background: {
            default: '#fff',
        },
        text: {
            primary: '#000'
        }
    },
});

export const plusPopOverTheme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#fff',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#fff',
            main: '#fff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
        },
        background: {
            default: '#2196f3',
            paper: 'inherit'
        },
        text: {
            primary: '#fff',
            secondary: "#bbb",
            disabled: "#999"
        },
    },
});
