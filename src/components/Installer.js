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
import ErrorBox from "./errors/ErrorBox";


const ConnectionError = ({message}) => {
    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 30,
            width: "80%",
            backgroundColor: "#d81b60",
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
    const [hasAdminAccount, setHasAdminAccount] = useState(null);
    const [error, setError] = useState(null);

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
                if(hasAdmin) {
                    new storageValue('tracardi-gui-instance').save(uuid4());
                    window.location.reload();
                }
            }
        } catch (e) {
            setError(e.toString())
        } finally {
            setProgress(false);
        }

    }

    if(error !== null) {
        return <ConnectionError message={error}/>
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
            {hasAdminAccount === false && <ErrorBox>Could not create admin account. Please fill correct e-mail and password.</ErrorBox>}
            {requireAdmin && <>
                <h2 style={{fontWeight: 300}}>Missing system administrator account</h2>
                <table>
                    <tbody>
                        <tr>
                            <td><Input label="E-mail" initValue="" onChange={(ev) => setEmail(ev.target.value)}/></td>
                            <td><PasswordInput value={password} onChange={(ev) => setPassword(ev.target.value)}/></td>
                        </tr>
                    </tbody>
                </table>
            </>}

            <Button label="Install" onClick={handleClick} progress={progress} style={{marginTop: 30}}/>

        </div>
    </div>
}

const Installer = () => {

    const [installed, setInstalled] = useState(null);
    const [hasAdminAccount, setHasAdminAccount] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isSubscribed = true
        asyncRemote({
            url: "/install"
        }).then((response) => {
            if (response && isSubscribed) {
                const result = response.data
                const hasAllIndices = Array.isArray(result?.missing) && result?.missing.length === 0
                const hasAdmin = result?.admins?.total !== 0

                setHasAdminAccount(hasAdmin)
                setInstalled(hasAllIndices && hasAdmin);
            }
        }).catch((e) => {
            if (isSubscribed) {
                setError(e.toString())
            }
        })

        return () => isSubscribed = false
    }, [])

    if (error !== null) {
        return <ConnectionError message={error}/>
    }

    if (installed === true) {
        const storage = new storageValue('tracardi-gui-instance')
        // Might be missing tracardi-gui-instance
        if(storage.read() === null) {
            storage.save(uuid4());
            window.location.reload();
        }
    } else if (installed === false) {
        return <InstallerMessage requireAdmin={!hasAdminAccount}/>
    }

    return <CenteredCircularProgress/>
}

export default Installer