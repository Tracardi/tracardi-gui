import { createTheme} from '@mui/material/styles';

export const stagingTheme = createTheme({
    typography: {
        "fontFamily": `"IBM Plex Sans", "Arial", sans-serif`,
        "fontSize": 15,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        primary: {
            main: '#3B82F6',  // #1976d2
            light: '#e1f5fe'  // e1f5fe
        },
        secondary: {
            main: '#EF6C00',
        },
        error: {
            main: "#d81b60",
        },
        success: {
            main: "#43a047",
        },
        gray: {
            main: "#ccc"
        },
        background: {
            default: 'whitesmoke',  // whitesmoke
            paper: "white" // white
        },
        text: {
            primary: '#000',
            secondary: '#444',
        },
        common: {
            white: "white",
            black: "black"
        }
    },
});

export const productionTheme = createTheme({
    typography: {
        "fontFamily": `"IBM Plex Sans", "Arial", sans-serif`,
        "fontSize": 15,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        primary: {
            main: '#ad1457',  // #1976d2
            light: '#f3e5f5'  // e1f5fe
        },
        secondary: {
            main: '#EF6C00',
        },
        error: {
            main: "#d81b60",
        },
        success: {
            main: "#43a047",
        },
        gray: {
            main: "#ccc"
        },
        background: {
            default: 'whitesmoke',  // whitesmoke
            paper: "white" // white
        },
        text: {
            primary: '#000',
            secondary: '#444',
        },
        common: {
            white: "white",
            black: "black"
        }
    },
});

export const signInTheme = createTheme({
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
            default: 'white',
        },
        text: {
            primary: '#000'
        }
    },
});

export const plusPopOverTheme = createTheme({
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
