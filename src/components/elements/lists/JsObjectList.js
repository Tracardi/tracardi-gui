import React, {useEffect} from 'react';
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {ObjectInspector} from 'react-inspector';
import theme from '../../../themes/inspector_light_theme'
// import {fetchData} from "../../../remote_api/uql_api_endpoint";
import {connect, useDispatch} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import { asyncRemote } from '../../../remote_api/entrypoint';

export function JsObjectList({uql}) {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ready, setReady] = React.useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        // fetchData(uql, '/console/select', setLoading, setError, setReady)
        setLoading(true);
        asyncRemote(
            {   
                url: "/console/select",
                method: "POST",
                data: {data: uql},
            }
        ).then((response) => {
            if (response?.status === 200) {
                setReady(response.data);
            }
        }).catch((e) => {
            setError(true);
        }).finally(() => {setLoading(false)})

    }, [uql])

    const loadingCircle = () => {
        if (loading) {
            return <CenteredCircularProgress/>
        }
    }

    const errorMessage = () => {
        if (error !== false) {
            dispatch(showAlert({message: error, type: "error", hideAfter: 5000}))
        }
    }

    const content = () => {
        if (ready !== false) {
            return  <ObjectInspector data={ready.data} theme={theme} expandLevel={3}/>
        }
    }

    return <React.Fragment>
        {errorMessage()}
        {loadingCircle()}
        {content()}
    </React.Fragment>
}

const mapProps = () => {
    return {}
}

export default connect(
    mapProps,
    {
        showAlert,
    },
)(JsObjectList)
