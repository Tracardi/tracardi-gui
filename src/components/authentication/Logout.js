import React from "react";
import {Redirect} from "react-router-dom";
import {logout} from "./login";
import urlPrefix from "../../misc/UrlPrefix";
import { getApiUrl } from "../../remote_api/entrypoint";

export default function Logout() {
    logout();
    return <Redirect to={urlPrefix("/login?api_url=" + getApiUrl())}/>
}