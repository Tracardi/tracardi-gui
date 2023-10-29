import React, {createContext, useEffect, useRef, useState} from 'react';
import Keycloak from "keycloak-js";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {getToken} from "../authentication/login";

export const KeyCloakContext = createContext({token: null, isAuthenticated: false});

const client = new Keycloak({
    url: "http://localhost:8081/auth/",
    realm: "tracardi",
    clientId: "tracardi"
})

export default function KeyCloakAuthProvider({children, enabled = false}) {

    const isRun = useRef(false)
    const [logged, setLogged] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {

        if (!enabled) {

            const _token = getToken();

            if (!_token) {
                setLogged(false)
                setToken(null);
                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
            } else {
                setLogged(true)
                setToken(_token);
            }
            return
        }

        window._env_.KC_URL = "http://localhost:8081/auth/"
        window._env_.KC_REALM = "tracardi"
        window._env_.KC_CLIENT_ID = "tracardi"

        if (isRun.current) return;

        isRun.current = true;

        client.init({
            onLoad: "login-required",
            // must match to the configured value in keycloak
            // redirectUri: 'http://localhost:3000/test/',
            // checkLoginIframe: false
        }).then((res) => {
            setLogged(res);
            setToken(client.token)
        })

    }, [])

    return <KeyCloakContext.Provider value={{token: token, isAuthenticated: logged}}>
        {logged ? children : <CenteredCircularProgress/>}
    </KeyCloakContext.Provider>
}
