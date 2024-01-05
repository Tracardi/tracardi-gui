import React, {useContext} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import NotAllowed from "./NotAllowed";
import urlPrefix from "../../misc/UrlPrefix";
import {KeyCloakContext} from "../context/KeyCloakContext";

export default function PrivateRoute({children, location, roles, ...rest}) {

    const authContext = useContext(KeyCloakContext)

    // console.log(location, authContext)

    function intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    const isAllowed = () => {

        // return true

        if(authContext?.state?.token && intersect(authContext?.state?.roles, roles).length > 0) {
            return true
        }
        return false
    }

    if (authContext?.state?.isAuthenticated) {
        if(isAllowed()) {
            return <Routes><Route {...rest} element={children} /></Routes>
        }
        return <Routes><Route {...rest} element={<NotAllowed/>} /></Routes>
    } else {
        return <Navigate to={urlPrefix("/login")} state={{from: location}} />
    }
};
