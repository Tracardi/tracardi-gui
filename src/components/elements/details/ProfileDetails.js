import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import {MiniHeader} from "../Headers";
import "./Details.css";
import Properties from "./DetailProperties";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import PiiDetails from "./PiiDetails";
import ProfileEventHeatMap from "./ProfileEventHeatMap";
import './ProfileDetails.css';

export default function ProfileDetails({data}) {

    return <div style={{height: "inherit"}}>
        <PiiDetails data={data}/>
        <div className="RightTabScroller">
            <Tabs tabs={["Traits", "Segments", "Events", "Raw"]} className="ProfileDetailsTabs">
                <TabCase id={0}>
                    <div className="Box10">
                        <MiniHeader>Private</MiniHeader>
                        <Properties properties={data.traits.private}/>
                        <MiniHeader>Public</MiniHeader>
                        <Properties properties={data.traits.public}/>
                    </div>
                </TabCase>
                <TabCase id={1}>
                    <div className="Box10">
                        <Properties properties={{segments: data.segments}}/>
                    </div>
                </TabCase>
                <TabCase id={2}>
                    <div style={{padding: 20}}>
                        <ProfileEventHeatMap profileId={data.id} />
                    </div>
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