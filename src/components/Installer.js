import React, {useEffect, useState} from "react";
import {asyncRemote, getError} from "../remote_api/entrypoint";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import ErrorsBox from "./errors/ErrorsBox";
import InstallerForm from "./InstallerForm";

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
        return <InstallerForm
            requireAdmin={!hasAdminAccount}
            onInstalled={() => setInstalled(true)}
            errorMessage={error}
        />
    }

    return children
}

export default Installer;