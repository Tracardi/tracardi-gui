import Button from "./elements/forms/Button";
import React, {useEffect, useState} from "react";
import storageValue from "../misc/localStorageDriver";
import {v4 as uuid4} from "uuid";
import {asyncRemote} from "../remote_api/entrypoint";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {BsCloudUpload} from "react-icons/bs";
import PasswordInput from "./elements/forms/inputs/PasswordInput";
import Input from "./elements/forms/inputs/Input";
import NoData from "./elements/misc/NoData";


const ConnectionError = ({message}) => {
    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 30,
            width: "80%",
            backgroundColor: "red",
            color: "white",
            borderRadius: 10
        }}>
            <NoData header="Connection error" iconColor="white">
                Could not connect to API. Please check if the backend API is working.
                <p>{message}</p>
            </NoData>
        </div>
    </div>
}


const InstallerMessage = ({requireAdmin}) => {

    const [progress, setProgress] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClick = async () => {
        try {
            setProgress(true);
            const response = await asyncRemote({
                url: "/install",
                method: "POST",
                data: {
                    username: email,
                    password: password
                }
            })
            if (response) {
                console.log(response)
            }
        } catch (e) {
            alert(e.toString())
        } finally {
            setProgress(false);
        }
        // new storageValue('tracardi-gui-instance').save(uuid4())
    }

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 50,
            width: "80%",
            backgroundColor: "white",
            borderRadius: 10
        }}>
            <BsCloudUpload size={50} style={{color: "#666"}}/>
            <h1 style={{fontWeight: 300}}>Installation required</h1>
            <p>Some parts of the system are missing. Please click install to install required components</p>
            {requireAdmin && <>
                <h2 style={{fontWeight: 300}}>Missing system administrator account</h2>
                <table>
                    <tr>
                        <td><Input label="E-mail" onChange={(ev) => setEmail(ev.target.value)}/></td>
                        <td><PasswordInput onChange={(ev) => setPassword(ev.target.value)}/></td>
                    </tr>
                </table>
            </>}
            <Button label="Install" onClick={handleClick} progress={progress} style={{marginTop: 30}}/>
        </div>
    </div>
}

const Installer = () => {

    const [installed, setInstalled] = useState(null);
    const [requiredAdmin, setRequireAdmin] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isSubscribed = true
        asyncRemote({
            url: "/install"
        }).then((response) => {
            if (response && isSubscribed) {
                const result = response.data
                const hasMissingIndices = Array.isArray(result?.missing) && result?.missing.length === 0
                setRequireAdmin(result?.admins?.total === 0)
                setInstalled(hasMissingIndices);
            }
        }).catch((e) => {
            if (isSubscribed) {
                setError(e.toString())
            }
        })

        return () => isSubscribed = false
    }, [])


    if (installed === true) {
        return "installed"
    } else if (installed === false) {
        return <InstallerMessage requireAdmin={requiredAdmin}/>
    }
    if (error !== false) {
        return <ConnectionError message={error}/>
    }
    return <CenteredCircularProgress/>
}

export default Installer