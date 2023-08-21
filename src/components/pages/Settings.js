import React, {useEffect, useState, useRef} from "react";
import KeyValueDesc from "../elements/misc/KeyValueDesc";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import ErrorsBox from "../errors/ErrorsBox";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import Button from "../elements/forms/Button";
import {getSystemSettings} from "../../remote_api/endpoints/system";


function TestingButtons() {

    const [esError, setEsError] = useState(null);
    const [redisError, setRedisError] = useState(null);
    const [redisLoading, setRedisLoading] = useState(false);
    const [esLoading, setEsLoading] = useState(false);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        asyncRemote({
            url: "/test/elasticsearch"
        })
        .catch(e => setEsError(e.response.data.detail));
        asyncRemote({
            url: "/test/redis"
        })
        .catch(e => setRedisError(e.response.data.detail));
        return () => mounted.current = false;
    }, [])

    const handleCheckEs = async () => {
        try {
            if (mounted.current === true) setEsLoading(true);
            const response = await asyncRemote({
                url: "/test/elasticsearch"
            })
            if (response.status === 200 && mounted.current === true) {
                setEsError(false);
            }
        }
        catch (e) {
            if (mounted.current === true) setEsError(e.response.data.detail);
        }
        finally {
            if (mounted.current === true) setEsLoading(false);
        }
    };

    const handleCheckRedis = async () => {
        try {
            if (mounted.current === true) setRedisLoading(true);
            const response = await asyncRemote({
                url: "/test/redis"
            })
            if (response.status === 200 && mounted.current === true) {
                setRedisError(false);
            }
        }
        catch (e) {
            if (mounted.current === true) setRedisError(e.response.data.detail);
        }
        finally {
            if (mounted.current === true) setRedisLoading(false);
        }
    };

    return (
        <>
            <div style={{display: "flex", flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Button 
                    label="Test Redis Server Connection"
                    style={{display: "flex", justifyContent: "center", minWidth: "20%", height: "50px"}} 
                    confirmed={!redisError} 
                    error={redisError}
                    progress={redisLoading}
                    onClick={handleCheckRedis}
                />
                <div style={{overflowWrap: "anywhere"}}>
                    {
                        redisError || "Redis is connected. Click the button to recheck the connection."
                    }
                </div>
            </div>
            <div style={{marginTop: 30, display: "flex", flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Button 
                    label="Test Elasticsearch Connection"
                    style={{display: "flex", justifyContent: "center", minWidth: "20%", height: "50px"}} 
                    confirmed={!esError} 
                    error={esError}
                    progress={esLoading}
                    onClick={handleCheckEs}
                />
                <div style={{overflowWrap: "anywhere"}}>
                    {
                        esError || "Elasticsearch is connected. Click the button to recheck connection."
                    }
                </div>
            </div>
        </>
    );


}

export default function Settings() {

    const [loading, setLoading] = useState(false);
    const [setting, setSettings] = useState([false]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        asyncRemote(
            getSystemSettings()
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
        {!loading && 
        <TuiForm style={{height: "inherit"}}>
            <TuiFormGroup style={{margin: 20}}>
                <TuiFormGroupHeader 
                    header="Elasticsearch and Redis test" 
                    description="Use buttons bellow to check the required connections to database and redis cache."
                />
                <TuiFormGroupContent>
                    <TestingButtons />
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup style={{margin: 20}}>
                <TuiFormGroupHeader header="Settings"
                                    description="Use environment variables to set the settings."
                />
                <TuiFormGroupContent>
                    {!error && setting.map((row, index) => {
                        return <KeyValueDesc key={index} label={row.label} value={row.value} description={row.desc}/>
                    })}
                    {error && <ErrorsBox errorList={error}/>}
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        }

    </>
}