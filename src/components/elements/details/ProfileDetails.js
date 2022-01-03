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
import ProfileEventHeatMap from "./ProfileEventHeatMap";
import './ProfileDetails.css';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";

export default function ProfileDetails({data}) {

    return <div style={{height: "inherit", display: "flex", flexDirection: "column"}}>
        <PiiDetails data={data}/>
        <div className="RightTabScroller">
            <Tabs tabs={["Traits", "Segments", "Events", "Raw"]} className="ProfileDetailsTabs">
                <TabCase id={0}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Traits"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField header="Private traits">
                                    <Properties properties={data?.traits?.private}/>
                                </TuiFormGroupField>
                                <TuiFormGroupField header="Public traits">
                                    <Properties properties={data?.traits?.public}/>
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Personally Identifiable Information"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField>
                                    <Properties properties={data?.pii}/>
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Customer consents"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField>
                                    <Properties properties={data?.consents}/>
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={1}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Segments"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField>
                                    <Properties properties={{segments: data.segments}}/>
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={2}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Events heatmap"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField>
                                    <ProfileEventHeatMap profileId={data.id} />
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={3}>
                    <div className="Box10">
                        <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs>
        </div>
    </div>;

}

ProfileDetails.propTypes = {
    data: PropTypes.object,
  };