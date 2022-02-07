import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function ResponsiveDialog({title, button, open, onClose, children}) {

    const handleClose = () => {
        if(onClose) {
            onClose()
        }
    };

    return (
        <Dialog
                fullWidth
                open={open}
                maxWidth={"lg"}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" style={{fontSize: "160%", fontWeight: 300}}>
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    {children}
                </DialogContent>
                <DialogActions>
                    {button}
                </DialogActions>
            </Dialog>
    );
}