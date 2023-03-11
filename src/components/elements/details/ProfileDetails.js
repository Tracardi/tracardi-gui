import React from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Properties from "./DetailProperties";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import PiiDetails from "./PiiDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {ProfileData} from "./ProfileInfo";
import ProfileSessionsDetails from "./ProfileSessionsDetails";
import ProfileLogDetails from "./ProfileLogDetails";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import useTheme from "@mui/material/styles/useTheme";
import JsonBrowser from "../misc/JsonBrowser";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfileById} from "../../../remote_api/endpoints/profile";
import FetchError from "../../errors/FetchError";

export default function ProfileDetails({profile}) {
    const _theme = useTheme()

    const displayPii = window?.CONFIG?.profile?.display?.details?.pii

    return <div style={{height: "inherit", display: "flex", flexDirection: "column"}}>
        {displayPii &&  <PiiDetails data={profile}/>}
        <div className="RightTabScroller">
            <Tabs tabs={["Personal data & Events", "Sessions & Events", "Logs", "Raw"]} tabsStyle={{backgroundColor: _theme.palette.primary.light}}>
                <TabCase id={0}>
                    <ProfileData profile={profile}/>
                </TabCase>
                <TabCase id={1}>
                    <ProfileSessionsDetails profileId={profile?.id}/>
                </TabCase>
                <TabCase id={2}>
                    <div className="Box10">
                        {profile?.id
                            ? <ProfileLogDetails profileId={profile.id} />
                            : <NoData header="This event has no profile attached.">
                                That means the profile was deleted.
                            </NoData>}
                    </div>
                </TabCase>
                <TabCase id={3}>
                    <div className="Box10">
                        <JsonBrowser data={profile}/>
                    </div>
                </TabCase>
            </Tabs>
        </div>
    </div>;
}

export function ProfileDetailsById({id}) {

    const query = useFetch(
        ["getProfile", [id]],
        getProfileById(id),
        data => {
            return data
        })

    if(query.isError) {
        if(query.error.status === 404)
            return <NoData header="Could not find profile.">
                This can happen if the profile was deleted or archived.
            </NoData>
        return <FetchError error={query.error}/>
    }

    if (query.isLoading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {query.data && <ProfileDetails profile={query.data} />}
    </>
}

ProfileDetails.propTypes = {
    profile: PropTypes.object,
  };