import withStyles from "@material-ui/core/styles/withStyles";
import Tab from "@material-ui/core/Tab";
import React from "react";

const ShortTab = withStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        minWidth: 72
    },
}))((props) => <Tab {...props} />);

export default ShortTab;