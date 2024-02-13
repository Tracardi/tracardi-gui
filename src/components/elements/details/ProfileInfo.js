import React from "react";
import {getError} from "../../../remote_api/entrypoint";
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
import {Grid} from "@mui/material";
import ProfileEvents from "./ProfileEvents";
import Tabs, {TabCase} from "../tabs/Tabs";
import useTheme from "@mui/material/styles/useTheme";
import NoData from "../misc/NoData";
import {ProfileImage} from "./ProfileImage";
import {displayLocation} from "../../../misc/location";
import Properties from "./DetailProperties";
import {useRequest} from "../../../remote_api/requestClient";
import EventStatusTag from "../misc/EventStatusTag";

export const ProfileData = ({profile}) => {

    const _theme = useTheme()

    const displayPii = window?.CONFIG?.profile?.display?.details?.pii

    const pii = object2dot(profile?.data?.pii, true);
    const traits = object2dot(profile?.traits, true)
    const aux = object2dot(profile?.aux, true)
    const media = object2dot(profile?.data?.media, true)
    const geo = object2dot(profile?.data?.devices?.last?.geo, true)
    const contact = object2dot(profile?.data?.contact, true);
    const profileFullName = profileName(profile)

    return <Grid container spacing={2} style={{padding: 20}}>
        <Grid item xs={6}>
            <div style={{display: "flex", gap: 20, padding: 20}}>
                <ProfileImage profile={profile}/>
                <div style={{width: "100%"}}>
                    <PropertyField name="Name" labelWidth={80} content={<ProfileLabel label={profileFullName}
                                                                         profileLess={profile === null}/>}/>
                    <PropertyField name="Visits" labelWidth={80} content={profile?.metadata?.time?.visit?.count}/>
                    {profile?.metadata?.time?.visit?.current &&
                    <PropertyField name="Last visit" labelWidth={80} content={<DateValue date={profile?.metadata.time.visit.current}/>}/>}
                </div>

            </div>
            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Profile metadata</legend>
                <PropertyField name="Id" content={<IdLabel label={profile.id}/>}/>
                {profile?._meta?.index && <PropertyField name="Index" content={profile?._meta?.index}/>}
                {profile?.metadata?.time?.create &&
                <PropertyField name="Created" content={<DateValue date={profile?.metadata?.time?.create}/>}/>}
                {profile?.metadata?.time?.insert &&
                <PropertyField name="Inserted" content={<DateValue date={profile?.metadata?.time?.insert}/>}/>}
                <PropertyField name="Updated" content={<DateValue date={profile?.metadata?.time?.update}/>}/>
                {profile?.metadata?.time?.segmentation && <PropertyField name="Segmented" content={<DateValue date={profile?.metadata?.time?.segmentation}/>}/>}
                {profile?.data?.devices?.last?.geo?.city && <PropertyField name="Last Visit Location" content={
                    <IconLabel
                        value={displayLocation(profile?.data?.devices?.last?.geo)}
                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                    />}/>}
                {profile?.metadata?.time?.visit?.last &&
                <PropertyField name="Previous Visit" content={<DateValue date={profile?.metadata.time.visit.last}/>}/>}

                {profile?.metadata?.time?.visit?.tz && <PropertyField name="Last Visit Time Zone"
                                                                      content={<IconLabel
                                                                          value={profile?.metadata.time.visit.tz}
                                                                          icon={<BsGlobe size={20}
                                                                                         style={{marginRight: 5}}/>}
                                                                      />}/>}


                {profile?.consents
                && <PropertyField name="Consents"
                                  content={<div className="flexLine" style={{gap: 5}}>
                                      <IconLabel
                                          value={isEmptyObjectOrNull(profile?.consents) ? "None granted" : <TuiTags
                                              size="small"
                                              style={{marginRight: 2}}
                                              tags={Object.getOwnPropertyNames(profile?.consents)}/>}
                                          icon={<VscLaw size={20} style={{marginRight: 5}}/>}/>
                                  </div>}/>}

                <PropertyField name="Status" content={<span className="flexLine">
                    <ActiveTag active={profile?.active}/><EventStatusTag
                    label={profile?.metadata?.system?.aux?.auto_merge ? "Merge pending" : "Merged"}
                    defaultSuccessLabel="Merged"
                    title="Merge status"
                /></span> }/>
            </fieldset>

            <div style={{borderRadius: 5, border: "solid 1px rgba(128,128,128,0.5)"}}>
                <Tabs tabs={["PII", "Contacts", "Traits", "Last GEO", "Media", "Aux"]}
                      tabsStyle={{backgroundColor: _theme.palette.background.paper}}>
                    <TabCase id={0}>
                        <div style={{margin: 20}}>
                            {displayPii && pii ? Object.keys(pii).map(key => <PropertyField key={key}
                                                                                            name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                            content={pii[key]}/>)
                                : <NoData header="No Personal Data"/>
                            }
                        </div>

                    </TabCase>
                    <TabCase id={1}>
                        <div style={{margin: 20}}>
                            {displayPii && contact ? Object.keys(contact).map(key => <PropertyField key={key}
                                                                                                    name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                                    content={contact[key]}/>)
                                : <NoData header="No Contact Data"/>
                            }
                        </div>
                    </TabCase>
                    <TabCase id={2}>
                        <div style={{margin: 20}}>
                            {traits && !isEmptyObjectOrNull(traits)
                                ? Object.keys(traits).map(key => <PropertyField key={key}
                                                                                   name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                   content={traits[key]}/>)

                                : <NoData header="No Traits"/>}
                        </div>
                    </TabCase>
                    <TabCase id={3}>
                        <div style={{margin: 20}}>
                            {geo && !isEmptyObjectOrNull(geo)
                                ? geo && Object.keys(geo).map(key => <PropertyField key={key}
                                                                                        name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                        content={geo[key]}/>)
                                : <NoData header="No Geo Location"/>}
                        </div>
                    </TabCase>
                    <TabCase id={4}>
                        <div style={{margin: 20}}>
                            {media && !isEmptyObjectOrNull(media)
                                ? media && Object.keys(media).map(key => <PropertyField key={key}
                                                                                    name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                    content={media[key]}/>)
                                : <NoData header="No Media"/>}
                        </div>
                    </TabCase>
                    <TabCase id={5}>
                        <div style={{margin: 20}}>
                            {aux && !isEmptyObjectOrNull(aux)
                                ? aux && Object.keys(aux).map(key => <PropertyField key={key}
                                                                                    name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                    content={aux[key]}/>)
                                : <NoData header="No Auxiliary Data"/>}
                        </div>
                    </TabCase>
                </Tabs>

            </div>
            <div style={{borderRadius: 5, border: "solid 1px rgba(128,128,128,0.5)", marginTop: 20}}>
                <Tabs tabs={["Segments", "Interests", "Preferences", "Metrics"]}
                      tabsStyle={{backgroundColor: _theme.palette.background.paper}}>
                    <TabCase id={0}>
                        <div style={{margin: 20}}>
                            {isNotEmptyArray(profile?.segments)
                                ? <div className="flexLine" style={{gap: 5}}><TuiTags tags={profile?.segments}/></div>
                                : <NoData header="No Segments"/>}
                        </div>
                    </TabCase>
                    <TabCase id={1}>
                        <div style={{margin: 20}}>
                            {!isEmptyObjectOrNull(profile?.interests)
                                ? Object.keys(profile?.interests).map(key => <PropertyField key={key}
                                                                                            name={key}
                                                                                            content={profile?.interests[key]}/>)
                                : <NoData header="No Interests"/>}
                        </div>
                    </TabCase>
                    <TabCase id={2}>
                        <div style={{margin: 20}}>
                            {!isEmptyObjectOrNull(profile?.data?.preferences)
                                ? Object.keys(profile?.data?.preferences).map(key => <PropertyField key={key}
                                                                                                    name={key}
                                                                                                    content={profile?.data?.preferences[key]}/>)
                                : <NoData header="No Preferences"/>}

                        </div>
                    </TabCase>
                    <TabCase id={3}>
                        <div style={{margin: 20}}>
                            <Properties properties={profile?.data?.metrics}/>
                        </div>
                    </TabCase>
                </Tabs>
            </div>
            <div style={{borderRadius: 5, border: "solid 1px rgba(128,128,128,0.5)", marginTop: 20}}>
                <Tabs tabs={["Job", "Loyalty", "Identifiers"]}
                      tabsStyle={{backgroundColor: _theme.palette.background.paper}}>
                    <TabCase id={0}>
                        <div style={{margin: 20}}>
                            {!isEmptyObjectOrNull(profile?.data?.job)
                                ? <Properties properties={profile?.data?.job}/>
                                : <NoData header="No Job Data"/>}
                        </div>
                    </TabCase>
                    <TabCase id={1}>
                        <div style={{margin: 20}}>
                            {!isEmptyObjectOrNull(profile?.data?.loyalty)
                                ? <Properties properties={profile?.data?.loyalty}/>
                                : <NoData header="No Loyality Data"/>}
                        </div>
                    </TabCase>
                    <TabCase id={2}>
                        <div style={{margin: 20}}>
                            {!isEmptyObjectOrNull(profile?.data?.identifier)
                                ? <Properties properties={profile?.data?.identifier}/>
                                : <NoData header="No Identifiers"/>}

                        </div>
                    </TabCase>
                </Tabs>
            </div>
        </Grid>
        <Grid item xs={6}>
            <fieldset style={{marginBottom: 20}}>
                <legend style={{fontSize: 13}}>Last events</legend>
                <ProfileEvents profileId={profile?.id}/>
            </fieldset>
        </Grid>
    </Grid>
}

const ProfileInfo = ({id}) => {

    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const {request} = useRequest()

    React.useEffect(() => {
        let isSubscribed = true;
        setError(null);
        setLoading(true);
        if (id) {
            request({
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