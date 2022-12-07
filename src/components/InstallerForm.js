import React, {useRef, useState} from "react";
import {asyncRemote, getApiUrl, getError, resetApiUrlConfig} from "../remote_api/entrypoint";
import {logout} from "./authentication/login";
import {BsCloudUpload} from "react-icons/bs";
import ReadOnlyInput from "./elements/forms/ReadOnlyInput";
import PasswordInput from "./elements/forms/inputs/PasswordInput";
import Input from "./elements/forms/inputs/Input";
import Button from "./elements/forms/Button";
import ErrorsBox from "./errors/ErrorsBox";
import ErrorBox from "./errors/ErrorBox";

const InstallerError = ({error, errorMessage, hasAdminAccount}) => {

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (errorMessage) {
        return <ErrorBox>{errorMessage}</ErrorBox>
    }

    if (hasAdminAccount === false) {
        return <ErrorBox>Could not create admin account. Please fill correct e-mail and password.</ErrorBox>
    }

    return ""
}

const InstallerForm = ({requireAdmin, onInstalled, errorMessage}) => {

    const [progress, setProgress] = useState(false);
    const [error, setError] = useState(null);
    const [hasAdminAccount, setHasAdminAccount] = useState(null);

    const data = useRef({
        username: "",
        password: "",
        token: "tracardi",
        needs_admin: requireAdmin
    })

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
                data: data.current
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
            <InstallerError error={error} errorMessage={errorMessage} hasAdminAccount={hasAdminAccount}/>
            {!error && <>
                <BsCloudUpload size={50} style={{color: "#666"}}/>
                <h1 style={{fontWeight: 300}}>Installation required</h1>
                <p style={{textAlign: "center", color: "gray"}}>Some parts of the system are missing. Please click
                    install to install required components</p>
            </>}
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
                <tr>
                    <td colSpan={2}>
                        <h2 style={{fontWeight: 300}}>
                            Installation token
                        </h2>
                        <p style={{color: "gray"}}>Input installation token. This is protection from unauthorized
                            installation. If this is a demo environment administrator most probably set the token to
                            default value <b>tracardi</b>. If not ask your admin for an installation token.
                        </p>
                        <PasswordInput label="Installation token"
                                       fullWidth={true}
                                       value={data.current.token}
                                       onEnter={handleClick}
                                       onChange={(ev) => data.current.token = ev.target.value}
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
                    </tr>
                    <tr>
                        <td style={{width: "50%"}}><Input
                            label="Valid e-mail"
                            initValue=""
                            onEnter={handleClick}
                            onChange={(ev) => data.current.username = ev.target.value}/>
                        </td>
                        <td style={{width: "50%"}}><PasswordInput
                            value={data.current.password}
                            onChange={(ev) => data.current.password = ev.target.value}
                            onEnter={handleClick}
                            fullWidth={true}/>
                        </td>
                    </tr>
                </>}
                </tbody>
            </table>

            <Button label="Install" onClick={handleClick} progress={progress} style={{marginTop: 30}} error={error}/>
        </div>
    </div>
}

export default InstallerForm;