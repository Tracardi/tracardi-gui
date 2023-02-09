import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React from "react";

export default function PaperBox({children}) {
    return  <Grid container xs={12} display="flex" justifyContent="center" alignItems="center" style={{height: "100%"}}>
        <Grid item xs={10} sm={8} md={7} lg={6} xl={5}>
            <Paper style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 50,
                backgroundColor: "white",
                borderRadius: 10
            }}>
                {children}
            </Paper>
        </Grid>
    </Grid>
}