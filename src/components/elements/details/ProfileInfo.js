import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {object2dot} from "../../../misc/dottedObject";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {BsCheckCircle, BsXSquare} from "react-icons/bs";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import PropertyField from "./PropertyField";

export const ProfileData = ({profile}) => {

    const pii = object2dot(profile?.pii);
    const privateTraits = object2dot(profile?.traits?.private)
    const publicTraits = object2dot(profile?.traits?.public)

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Profile info"
                                description="Profile information for this event."/>
            <TuiFormGroupContent>
                <PropertyField name="Visits" content={profile?.stats?.visits}/>
                <PropertyField name="Views" content={profile?.stats?.views}/>
                <PropertyField name="Consents"
                               content={profile?.consents && Object.keys(profile?.consents).join(", ")}/>
                <PropertyField name="Active" content={profile?.active
                    ? <BsCheckCircle size={24} color="#00c853"/> :
                    <BsXSquare size={24} color="#d81b60"/>}
                />
                {pii && Object.keys(pii).map(key => <PropertyField key={key}
                                                                   name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                   content={pii[key]}/>)}


            </TuiFormGroupContent>
        </TuiFormGroup>

        {privateTraits && !isEmptyObjectOrNull(privateTraits) && <TuiFormGroup>
            <TuiFormGroupHeader header="Private traits"
                                description="Private traits of profile for selected event."/>
            <TuiFormGroupContent>

                {Object.keys(privateTraits).map(key => <PropertyField key={key}
                                                                      name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                      content={privateTraits[key]}/>)}

            </TuiFormGroupContent>
        </TuiFormGroup>}

        {privateTraits && !isEmptyObjectOrNull(privateTraits) && <TuiFormGroup>
            <TuiFormGroupHeader header="Public traits"
                                description="Public traits of profile for selected event."/>
            <TuiFormGroupContent>

                {publicTraits && Object.keys(publicTraits).map(key => <PropertyField key={key}
                                                                                     name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                     content={publicTraits[key]}/>)}
            </TuiFormGroupContent>
        </TuiFormGroup>}
    </TuiForm>
}

const ProfileInfo = ({id}) => {

    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);


    React.useEffect(() => {
        let isSubscribed = true;
        setError(null);
        setLoading(true);
        if (id) {
            asyncRemote({
                url: "/profile/" + id
            })
                .then(response => {
                    if (isSubscribed && response?.data) {
                        setProfile(response.data);
                    }
                })
                .catch(e => {
                    if (isSubscribed) setError(getError(e))
                })
                .finally(() => {
                    if (isSubscribed) setLoading(false)
                })
        }
        return () => isSubscribed = false;
    }, [id])

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <ProfileData profile={profile}/>
}

export default ProfileInfo;