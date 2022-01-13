import withStyles from '@mui/styles/withStyles';
import Tab from "@mui/material/Tab";
import React from "react";

const ShortTab = withStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        minWidth: 72
    },
}))((props) => <Tab {...props} />);

export default ShortTab;