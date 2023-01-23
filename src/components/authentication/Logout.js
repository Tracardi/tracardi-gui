import React from "react";
import {Navigate} from "react-router-dom";
import {logout} from "./login";
import urlPrefix from "../../misc/UrlPrefix";
import { getApiUrl } from "../../remote_api/entrypoint";

export default function Logout() {
    logout();
    return <Navigate to={urlPrefix("/login?api_url=" + getApiUrl())}/>
}