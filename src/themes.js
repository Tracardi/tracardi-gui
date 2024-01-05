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

export const darkTheme = createTheme({
    typography: {
        "fontFamily": `"IBM Plex Sans", "Arial", sans-serif`,
        "fontSize": 15,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        mode: "dark",
        primary: {
            main: '#805fcf',  // #1976d2
            light: '#444444'  // e1f5fe
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
            main: "#444444"
        },
        background: {
            default: '#222222',  // whitesmoke
            paper: "#333333" // white
        },
        text: {
            primary: '#eee',
            secondary: '#bbb',
        },
        common: {
            white: "#444",
            black: "#eee"
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111'
                }
            }
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    color: 'lightgray',
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: 'white',
                    },
                    '&.Mui-disabled': {
                        color: 'lightgray',
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rbga(200,200,200,.2)',
                    borderColor: "#f5f5f5",
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(200,200,200,.3)',
                        borderColor: "white",
                    },
                },
            },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    // Your custom styles for adornments
                    color: 'lightgrey',
                    // Other styles as needed
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    // Styles for disabled labels
                    color: 'lightgrey', // Example color
                    '&.Mui-focused': {
                        color: 'lightgrey',
                    }
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    // This targets the input part of the OutlinedInput
                    '&.Mui-disabled': {
                        // Styles when the OutlinedInput is disabled
                        color: 'lightgrey', // Example: change text color
                        "-webkit-text-fill-color": "lightgrey",
                        '& .MuiInputAdornment-root': {
                            color: 'lightgrey',

                        },
                        "& .MuiInputLabel-root": {
                            color: 'lightgrey',
                        }
                    }
                },
                root: {
                    '&.Mui-disabled': {
                        color: 'lightgrey',
                        '& .MuiInputAdornment-root': {
                            color: 'lightgrey',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            color: 'lightgrey',
                            borderColor: 'lightgrey',
                        },
                    },
                    '&.MuiInputAdornment-root': {
                        color: 'lightgrey',
                    },
                    // Target the root style
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Change border color when focused
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Change border color on hover
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999', // Default border color
                    },
                    '&.MuiInputLabel-outlined': {
                        color: 'lightgrey',
                        '& .MuiInputAdornment-root': {
                            color: 'lightgrey',
                        },
                    }
                }
            },
        },
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
