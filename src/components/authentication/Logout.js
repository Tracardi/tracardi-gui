import React from "react";
import {Redirect} from "react-router-dom";
import {logout} from "./login";
import urlPrefix from "../../misc/UrlPrefix";

export default function Logout() {
    logout();
    return <Redirect to={urlPrefix("/login")}/>
}