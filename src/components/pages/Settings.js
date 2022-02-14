import React, {useEffect, useState} from "react";
import KeyValueDesc from "../elements/misc/KeyValueDesc";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import ErrorsBox from "../errors/ErrorsBox";
import {asyncRemote, getError} from "../../remote_api/entrypoint";

export default function Settings() {

    const [loading, setLoading] = useState(false);
    const [setting, setSettings] = useState([false]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        asyncRemote(
            {
                method: "get",
                url: "/settings"
            }
        ).then((response) => {
            setLoading(false);
            if (response) {
                setSettings(response.data);
            }
        }).catch((e) => {
            if (e) {
                setLoading(false);
                if (e) {
                    setError(getError(e));
                }
            }
        })

    }, [])

    return <>
        {loading &&  <div style={{height: 300}}><CenteredCircularProgress/></div>}
        {!loading && <TuiForm style={{height: "inherit", overflowY: "auto"}}>
            <TuiFormGroup style={{margin: 20}}>
                <TuiFormGroupHeader header="Settings"
                                    description="Use environment variables to set these settings."
                />
                <TuiFormGroupContent>
                    {!error && setting.map((row, index) => {
                        return <KeyValueDesc key={index} label={row.label} value={row.value} description={row.desc}/>
                    })}
                    {error && <ErrorsBox errorList={error}/>}
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>}

    </>
}