import storageValue from "../../misc/localStorageDriver";
import React, {useState} from "react";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";

const ServerContext = ({style, showAlert}) => {

    const navigate = useNavigate();

    const storage = new storageValue('.tr-srv-context')
    const context = storage.read('staging')

    const go = (url) => {
        return navigate(urlPrefix(url));
    }

    function handleOnClick(production) {
        if (production) {
            storage.save('production')
            showAlert({message: "Now you are working on production server", type: "warning", hideAfter: 4000});
        } else {
            storage.save('staging');
            showAlert({message: "Now you are working on staging server", type: "warning", hideAfter: 4000});
        }
        go("/dashboard")
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

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(ServerContext);