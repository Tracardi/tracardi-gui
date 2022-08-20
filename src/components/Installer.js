import Button from "./elements/forms/Button";
import React, {useEffect, useState} from "react";
import {asyncRemote, getApiUrl, getError, resetApiUrlConfig} from "../remote_api/entrypoint";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {BsCloudUpload} from "react-icons/bs";
import PasswordInput from "./elements/forms/inputs/PasswordInput";
import Input from "./elements/forms/inputs/Input";
import ErrorBox from "./errors/ErrorBox";
import ReadOnlyInput from "./elements/forms/ReadOnlyInput";
import {logout} from "./authentication/login";
import ErrorsBox from "./errors/ErrorsBox";


const InstallerError = ({error, errorMessage, hasAdminAccount}) => {

    if (error) {
        return <ErrorBox>{error}</ErrorBox>
    }

    if (errorMessage) {
        return <ErrorBox>{errorMessage}</ErrorBox>
    }

    if (hasAdminAccount === false) {
        return <ErrorBox>Could not create admin account. Please fill correct e-mail and password.</ErrorBox>
    }

    return ""
}

const InstallerMessage = ({requireAdmin, onInstalled, errorMessage}) => {

    const [progress, setProgress] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasAdminAccount, setHasAdminAccount] = useState(null);
    const [error, setError] = useState(null);

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        logout();
        window.location.reload()
    }

    const handleClick = async () => {
        try {
            setError(null);
            setProgress(true);
            setHasAdminAccount(null);
            const response = await asyncRemote({
                url: "/install",
                method: "POST",
                data: {
                    username: email,
                    password: password
                }
            })
            if (response) {
                const result = response.data
                const hasAdmin = result?.admin
                setHasAdminAccount(hasAdmin)
                if (hasAdmin) {
                    onInstalled()
                }
            }
        } catch (e) {
            setError(getError(e))
        } finally {
            setProgress(false);
        }

    }

    if(error) {
        return <ErrorsBox errorList={error}/>
    }

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 50,
            width: "70%",
            maxWidth: 660,
            backgroundColor: "white",
            borderRadius: 10
        }}>
            <BsCloudUpload size={50} style={{color: "#666"}}/>
            <h1 style={{fontWeight: 300}}>Installation required</h1>
            <p style={{textAlign: "center", color: "gray"}}>Some parts of the system are missing. Please click install to install required components</p>

            <table>
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <ReadOnlyInput label="Tracardi API"
                                       value={getApiUrl()}
                                       onReset={handleEndpointReset}
                        />
                    </td>
                </tr>
                {requireAdmin && <>
                <tr>
                    <td colSpan={2} style={{textAlign: "center"}}>
                        <h2 style={{fontWeight: 300}}>
                            {requireAdmin && "Please set-up missing system administrator account"}
                            {!requireAdmin && "Please complete installation"}
                        </h2>
                        <span style={{color: "gray"}}>Please use valid e-mail to open an Admin account.<br/>
                        Otherwise account may not have access to all system features.</span><br/><br/></td>
                </tr><tr>
                    <td><Input label="Valid e-mail" initValue="" onChange={(ev) => setEmail(ev.target.value)}/></td>
                    <td><PasswordInput value={password} onChange={(ev) => setPassword(ev.target.value)}/></td>
                </tr></>}
                </tbody>
            </table>

            <Button label="Install" onClick={handleClick} progress={progress} style={{marginTop: 30}} error={error}/>
            <InstallerError error={error} errorMessage={errorMessage} hasAdminAccount={hasAdminAccount}/>
        </div>
    </div>
}

const Installer = ({children}) => {

    const [installed, setInstalled] = useState(false);
    const [hasAdminAccount, setHasAdminAccount] = useState(false);
    const [error, setError] = useState(null);
    const [wait, setWait] = useState(true);

    useEffect(() => {
            let isSubscribed = true;
            if (isSubscribed) setWait(true);
            asyncRemote({
                url: "/install",
            }).then((response) => {
                if(isSubscribed) {
                    if (response) {
                        const result = response.data
                        const adminOK = result?.admin_ok
                        const schemaOk = result?.schema_ok

                        setHasAdminAccount(adminOK);
                        setInstalled(schemaOk);

                    } else {
                        setInstalled(false);
                    }
                }
            }).catch((e) => {
                if (isSubscribed) setError(getError(e));
            }).finally(() => {
                if (isSubscribed) setWait(false)
            })

            return () => isSubscribed = false
        }
        , []);

    if (wait === true) {
        return <CenteredCircularProgress/>
    }

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (installed === false) {
        return <InstallerMessage
            requireAdmin={!hasAdminAccount}
            onInstalled={() => setInstalled(true)}
            errorMessage={error}
        />
    }

    return children
}

export default Installer;