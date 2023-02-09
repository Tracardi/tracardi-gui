import storageValue from "../../misc/localStorageDriver";
import React from "react";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";

const ServerContext = ({style}) => {

    const navigate = useNavigate();

    const storage = new storageValue('.tr-srv-context')
    const context = storage.read('staging')

    const go = (url) => {
        return navigate(urlPrefix(url));
    }

    function handleOnClick(production) {
        if (production) {
            storage.save('production')
            go("/context/production")
        } else {
            storage.save('staging');
            go("/context/staging")
        }

    }

    function display() {
        if (context === 'production') {
            return <span className="Context" style={{backgroundColor: "#d81b60"}}
                         onClick={() => handleOnClick(false)}>production</span>
        } else {
            return <span className="Context" style={{backgroundColor: "white", color: "black"}}
                         onClick={() => handleOnClick(true)}>staging</span>
        }
    }


    return <span style={style}>{display()}</span>
}

export default ServerContext;