import React from "react";
import Link from "@mui/material/Link";
import urlPrefix from "../../misc/UrlPrefix";
import NoData from "../elements/misc/NoData";
import {BsFillShieldLockFill} from "react-icons/bs";

export default function NotAllowed() {
    return <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent:"center"}}>
        <NoData header="You do not have rights to this part of the system" icon={<BsFillShieldLockFill size={40}/>}>
            <p>Please <Link color="inherit" href={urlPrefix("/login")}>
                Log-in
            </Link> again.</p>
        </NoData>
    </div>
}