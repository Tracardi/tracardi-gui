import React, {useContext} from "react";
import Link from "@mui/material/Link";
import urlPrefix from "../../misc/UrlPrefix";
import NoData from "../elements/misc/NoData";
import {BsFillShieldLockFill} from "react-icons/bs";
import {KeyCloakContext} from "../context/KeyCloakContext";

export default function NotAllowed() {

    const authContext=useContext(KeyCloakContext)

    const handleRelogin = () => {
        if(authContext.logout) authContext.logout()
    }

    return <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent:"center"}}>
        <NoData header="You do not have rights to this part of the system" icon={<BsFillShieldLockFill size={40}/>}>
            <p>Please <Link color="inherit" style={{cursor: "pointer"}} onClick={handleRelogin}>
                Log-in
            </Link> again.</p>
        </NoData>
    </div>
}