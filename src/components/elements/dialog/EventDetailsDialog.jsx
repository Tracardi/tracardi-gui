import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import EventData from "../details/EventData";

const EventDetailsDialog = ({event, open, onClose}) => {

    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth={true}
                maxWidth="lg"
        >
            <DialogContent style={{padding:0}} dividers>
                <EventData event={event} metadata={true} routing={false} allowedDetails={[]}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventDetailsDialog;