import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
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
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";

export default function ProfileDetails({profile}) {

    return <div style={{height: "inherit", display: "flex", flexDirection: "column"}}>
        <PiiDetails data={profile}/>
        <div className="RightTabScroller">
            <Tabs tabs={["Personal data & Traits", "Sessions & Events", "Segments", "Logs", "Raw"]} tabsStyle={{backgroundColor: "#e1f5fe"}}>
                <TabCase id={0}>
                    <ProfileData profile={profile}/>
                </TabCase>
                <TabCase id={1}>
                    <ProfileSessionsDetails profileId={profile?.id}/>
                </TabCase>
                <TabCase id={2}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Segments"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField>
                                    <Properties properties={{segments: profile?.segments}}/>
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={3}>
                    <div className="Box10">
                        <ProfileLogDetails profileId={profile.id} />
                    </div>
                </TabCase>
                <TabCase id={4}>
                    <div className="Box10">
                        <ObjectInspector data={profile} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs>
        </div>
    </div>;
}

export function ProfileDetailsById({id}) {

    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [noData, setNoData] = React.useState(false);

    React.useEffect(() => {
        let isSubscribed = true;
        setError(null);
        setLoading(true);
        setNoData(false);
        if (id) {
            asyncRemote({
                url: "/profile/" + id
            })
                .then(response => setProfile(response.data))
                .catch(e => {
                    if(isSubscribed) {
                        if(e.request && e.request.status === 404) {
                            setNoData(true)
                        } else {
                            setError(getError(e))
                        }
                    }
                })
                .finally(() => {if(isSubscribed) setLoading(false)})
        }
        return () => isSubscribed = false;
    }, [id])

    if(noData) {
        return <NoData header="Could not find profile.">
            This can happen if the profile was deleted or archived.
        </NoData>
    }

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {profile && <ProfileDetails profile={profile} />}
    </>
}

ProfileDetails.propTypes = {
    profile: PropTypes.object,
  };