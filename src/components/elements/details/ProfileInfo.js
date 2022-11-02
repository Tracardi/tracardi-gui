import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {object2dot} from "../../../misc/dottedObject";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {isEmptyObjectOrNull, isNotEmptyArray} from "../../../misc/typeChecking";
import PropertyField from "./PropertyField";
import ActiveTag from "../misc/ActiveTag";
import TuiTags from "../tui/TuiTags";
import IdLabel from "../misc/IconLabels/IdLabel";
import DateValue from "../misc/DateValue";
import ProfileLabel from "../misc/IconLabels/ProfileLabel";
import {profileName} from "../../../misc/formaters";
import IconLabel from "../misc/IconLabels/IconLabel";
import {BsGlobe} from "react-icons/bs";
import {VscLaw} from "react-icons/vsc";

export const ProfileData = ({profile}) => {

    const pii = object2dot(profile?.pii);
    const stats = object2dot(profile?.stats);
    const privateTraits = object2dot(profile?.traits?.private)
    const publicTraits = object2dot(profile?.traits?.public)

    return <div style={{margin: 20, display: "flex", gap: 20}}>
        <div style={{width: "50%"}}>
            {pii && <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Profile personal data</legend>
                {Object.keys(pii).map(key => <PropertyField key={key}
                                                            name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                            content={pii[key]}/>)}
            </fieldset>}

            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Private traits</legend>
                {privateTraits && !isEmptyObjectOrNull(privateTraits)
                    ? Object.keys(privateTraits).map(key => <PropertyField key={key}
                                                                           name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                           content={privateTraits[key]}/>)
                    : "None"}
            </fieldset>

            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Public traits</legend>
                {publicTraits && !isEmptyObjectOrNull(publicTraits)
                    ? publicTraits && Object.keys(publicTraits).map(key => <PropertyField key={key}
                                                                                          name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                          content={publicTraits[key]}/>)
                    : "None"}
            </fieldset>
        </div>
        <div style={{width: "50%"}}>
            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Profile metadata</legend>
                <PropertyField name="Id" content={<IdLabel label={profile.id}/>}/>
                <PropertyField name="Profile" content={<ProfileLabel label={profileName(profile)}
                                                                     profileLess={profile === null}/>}/>
                {profile?.metadata?.time?.insert &&
                <PropertyField name="Created" content={<DateValue date={profile?.metadata.time.insert}/>}/>}
                {profile?.metadata?.time?.visit?.count &&
                <PropertyField name="Visits" content={profile?.metadata.time.visit.count}/>}
                {profile?.metadata?.time?.visit?.last &&
                <PropertyField name="Previous visit" content={<DateValue date={profile?.metadata.time.visit.last}/>}/>}
                {profile?.metadata?.time?.visit?.current &&
                <PropertyField name="Last visit" content={<DateValue date={profile?.metadata.time.visit.current}/>}/>}
                {profile?.metadata?.time?.visit?.tz && <PropertyField name="Last visit time zone"
                                                                      content={<IconLabel
                                                                          value={profile?.metadata.time.visit.tz}
                                                                          icon={<BsGlobe size={20}
                                                                                         style={{marginRight: 5}}/>}
                                                                      />}/>}
                {profile?.consents
                    && <PropertyField name="Consents"
                                     content={<div className="flexLine" style={{gap: 5}}>
                                         <IconLabel
                                             value={isNotEmptyArray(profile?.consents) ? <TuiTags tags={profile?.consents}/> : "None granted"}
                                             icon={<VscLaw size={20} style={{marginRight: 5}}/>}/>
                                     </div>}/>}

                <PropertyField name="Active" content={<ActiveTag active={profile?.active}/>}
                />
            </fieldset>

            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Profile segments</legend>
                {isNotEmptyArray(profile?.segments)
                    ? <div className="flexLine" style={{gap: 5}}><TuiTags tags={profile?.segments}/></div>
                    : "None"}
            </fieldset>

            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Profile interests</legend>
                {isNotEmptyArray(profile?.interests)
                    ? <div className="flexLine" style={{gap: 5}}><TuiTags tags={profile?.interests}/></div>
                    : "None"}
            </fieldset>

            {stats && <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Profile stats</legend>
                {Object.keys(stats).map(key => <PropertyField key={key}
                                                              name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                              content={stats[key]}/>)}
            </fieldset>}

        </div>
    </div>
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