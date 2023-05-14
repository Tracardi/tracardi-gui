import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import JsonBrowser from "../misc/JsonBrowser";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";

const ModalDialog = ({open, onClose, children, fullWidth=true}) => {

    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth={fullWidth}
                maxWidth="lg"
        >
            <DialogContent style={{padding:0}} dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalDialog;