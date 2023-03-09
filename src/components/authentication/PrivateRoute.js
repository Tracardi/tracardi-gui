import React from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import {getRoles, getToken, isAuth} from "./login";
import NotAllowed from "./NotAllowed";
import urlPrefix from "../../misc/UrlPrefix";

export default function PrivateRoute({children, location, roles, ...rest}) {

    function intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }
    console.log(getToken(), getRoles())
    const isAllowed = () => {
        if(getToken() && intersect(getRoles(), roles).length > 0) {
            return true
        }
        return false
    }

    return (
        isAuth()
            ?
            isAllowed()
              ?
              <Routes><Route {...rest} element={children} /></Routes>
              :
              <Routes><Route {...rest} element={<NotAllowed/>} /></Routes>
            :
            <Navigate to={urlPrefix("/login")} state={{from: location}} />
    )
};
