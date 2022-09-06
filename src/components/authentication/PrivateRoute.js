import React from "react";
import {Route, Redirect} from "react-router-dom";
import {getRoles, isAuth} from "./login";
import NotAllowed from "./NotAllowed";
import urlPrefix from "../../misc/UrlPrefix";

export default function PrivateRoute({children, location, roles, ...rest}) {

    function intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    const isAllowed = () => {
        if(intersect(getRoles(), roles).length > 0) {
            return true
        }
        return false
    }

    return (
        <Route {...rest}>
            {
                isAuth()
                    ? isAllowed() ? children : <NotAllowed/>
                    : <Redirect to={
                        {
                            pathname: urlPrefix("/login"),
                            state: {from: location}
                        }
                    }/>
            }
        </Route>
    )
};
