import React, {createContext, useEffect, useRef, useState} from 'react';
import Keycloak from "keycloak-js";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import SignIn from "../authentication/SignIn";

window._env_.KC_URL = "http://localhost:8081/auth/"
window._env_.KC_REALM = "tracardi"
window._env_.KC_CLIENT_ID = "tracardi"

const keycloak = new Keycloak({
    url: window._env_.KC_URL,
    realm: window._env_.KC_REALM,
    clientId: window._env_.KC_CLIENT_ID
})

export const KeyCloakContext = createContext({state: null, setState: null, logout: null, keyClock: null});


export default function KeyCloakAuthProvider({children, enabled = false}) {

    const isRun = useRef(false)
    const [state, setState] = useState({token: null, isAuthenticated: false, roles: [], keyClock: enabled})

    const isLogged = state.isAuthenticated && state.token;

    useEffect(() => {

        if (!enabled) {

            if (!isLogged) {
                logout()
            }
            return
        }

        if (isRun.current) return;

        isRun.current = true;

        keycloak.init({
            onLoad: "login-required",
            // must match to the configured value in keycloak
            // redirectUri: 'http://localhost:3000/test/',
            // checkLoginIframe: false
        }).then((res) => {
            setState({token: keycloak.token,
                isAuthenticated: res,
                roles: [],
                keyClock: enabled
            })
        })

    }, [])

    const logout = () => {
        if(enabled) {
            try {
                keycloak.logout().then(
                    () => console.log("Logged out from keycloak")
                )
            } catch (e) {
                console.error(e)
            }
        }
        setState({token: null, isAuthenticated: false, roles: [], keyClock: enabled})
    }

    return <KeyCloakContext.Provider value={{state, setState, logout, keyClock: enabled}}>
        {isLogged ? children : (enabled
            ? <CenteredCircularProgress/>  // Waits for redirect
            : <SignIn/>  // Shows Form
            )}
    </KeyCloakContext.Provider>
}
