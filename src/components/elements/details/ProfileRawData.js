import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupHeader} from "../tui/TuiForm";
import {ObjectInspector} from "react-inspector";

const ProfileRawData = ({id}) => {

    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setError(null);
            setLoading(true);
        }
        if (id) {
            asyncRemote({
                url: "/profile/" + id
            })
                .then(response => setProfile(response.data))
                .catch(e => setError(getError(e)))
                .finally(() => setLoading(false))
        }
        return () => isSubscribed = false;
    }, [id])

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Profile raw data"/>

            <div style={{margin: 10}}>
                <ObjectInspector data={profile} expandLevel={5}/>
            </div>
            }
        </TuiFormGroup>
    </TuiForm>
}

export default ProfileRawData;
