import React, {useState} from "react";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import InstallerForm from "./InstallerForm";
import {useFetch} from "../remote_api/remoteState";
import {getInstallStatus} from "../remote_api/endpoints/system";
import FetchError from "./errors/FetchError";

const Installer = ({children}) => {

    const [installed, setInstalled] = useState(false);

    const {isLoading, data, error} = useFetch(
        ["installStatus", [installed]],
        getInstallStatus(),
        data => {
            return data
        }
    )

    if (isLoading === true) {
        return <CenteredCircularProgress/>
    }

    if (error) {
        return <FetchError error={error}/>
    }

    if (data?.schema_ok !== true) {
        return <InstallerForm
            requireAdmin={!data?.admin_ok}
            onInstalled={() => setInstalled(true)}
            errorMessage={error}
        />
    }

    return children
}

export default Installer;