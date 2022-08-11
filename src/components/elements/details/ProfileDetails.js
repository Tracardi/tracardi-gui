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

export default function ProfileDetails({profile}) {

    return <div style={{height: "inherit", display: "flex", flexDirection: "column"}}>
        <PiiDetails data={profile}/>
        <div className="RightTabScroller">
            <Tabs tabs={["Sessions & Events", "Traits & PII", "Segments", "Raw"]} tabsStyle={{backgroundColor: "#e1f5fe"}}>
                <TabCase id={0}>
                    <ProfileSessionsDetails profileId={profile?.id}/>
                </TabCase>
                <TabCase id={1}>
                    <ProfileData profile={profile}/>
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
                        <ObjectInspector data={profile} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs>
        </div>
    </div>;

}

ProfileDetails.propTypes = {
    profile: PropTypes.object,
  };