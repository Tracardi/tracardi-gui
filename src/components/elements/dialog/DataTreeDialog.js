import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import JsonBrowser from "../misc/JsonBrowser";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";

const DataTreeDialog = ({data, open, onClose}) => {

    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth={true}
                maxWidth="lg"
        >
            <DialogContent style={{padding:0}} dividers>
                <JsonBrowser data={data}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DataTreeDialog;