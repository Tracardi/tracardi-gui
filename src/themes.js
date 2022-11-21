import { createTheme} from '@mui/material/styles';

// export const mainTheme = createTheme({
//     typography: {
//         "fontFamily": `"IBM Plex Sans", "Arial", sans-serif`,
//         "fontSize": 15,
//         "fontWeightLight": 300,
//         "fontWeightRegular": 400,
//         "fontWeightMedium": 500
//     },
//     palette: {
//         primary: {
//             main: '#1976d2',
//         },
//         secondary: {
//             main: '#EF6C00',
//         },
//         error: {
//             main: "#d81b60",
//         },
//         success: {
//             main: "#43a047",
//         },
//         gray: {
//             main: "#ccc",
//         },
//         background: {
//             default: '#ccc',
//         },
//         text: {
//             primary: '#000'
//         }
//     },
// });

export const mainTheme = {
    typography: {
        "fontFamily": `"IBM Plex Sans", "Arial", sans-serif`,
        "fontSize": 15,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        primary: {
            main: '#1976d2',
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
            main: "#ccc",
        },
        background: {
            default: '#ccc',
        },
        text: {
            primary: '#000'
        }
    },
};

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
            default: '#fff',
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
