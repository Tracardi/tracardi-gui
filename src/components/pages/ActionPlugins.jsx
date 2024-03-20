import React, {useCallback, useState} from "react";
import PluginForm from "../elements/forms/PluginForm";
import CardBrowser from "../elements/lists/CardBrowser";
import Button from "../elements/forms/Button";
import {IoRefreshCircle} from "react-icons/io5";
import {useRequest} from "../../remote_api/requestClient";

export function ReinstallButton() {

    const [progress, setProgress] = useState(false);
    const [error, setError] = useState(null);

    const {request} = useRequest()

    const handlePluginsReinstall = async () => {
        try {
            setError(null);
            setProgress(true);
            const response = await request({
                url: "/install/plugins"
            })

            if(response.status === 200) {
                setError(false)
            }
        } catch (e) {
            setError(true)
        } finally {
            setProgress(false)
        }
    }

    return <Button label="Plugins"
                   icon={<IoRefreshCircle size={20}/>}
                   onClick={handlePluginsReinstall}
                   progress={progress}
                   error={error}
                   confirmed={error === null ? null : !error}
    />
}


export default function ActionPlugins() {

    const urlFunc= useCallback(query => ('/flow/action/plugins' + ((query) ? "?query=" + query : "")),[]);
    const detailsFunc=  useCallback(id => <PluginForm id={id}/>, []);
    const descFunc = useCallback(row => (<>{row?.plugin?.metadata?.desc} (v{row?.plugin?.spec?.version})</>), [])

    return <>
        <div style={{display: "flex", justifyContent: "flex-end", margin: "0 15px"}}><ReinstallButton/></div>
        <CardBrowser
            label="Action plugins"
            urlFunc={urlFunc}
            drawerDetailsWidth={800}
            detailsFunc={detailsFunc}
            forceMode='no-deployment'
            deleteEndpoint='/flow/action/plugin/'
            descriptionFunc={descFunc}
        />
    </>
}
