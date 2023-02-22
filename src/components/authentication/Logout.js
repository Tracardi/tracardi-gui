import React from "react";
import {Navigate} from "react-router-dom";
import {logout} from "./login";
import urlPrefix from "../../misc/UrlPrefix";

export default function Logout() {
    logout();
    return <Navigate to={urlPrefix("/login")}/>
}