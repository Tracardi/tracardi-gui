import Typography from "@mui/material/Typography";
import React from "react";
import Link from "@mui/material/Link";
import urlPrefix from "../../misc/UrlPrefix";

export default function NotAllowed() {
    return (
        <Typography variant="body2" color="textPrimary" align="center">
            You do not have rights to this page.
            <Link color="inherit" href={urlPrefix("/login")}>
                Log-in
            </Link>.
        </Typography>
    );
}