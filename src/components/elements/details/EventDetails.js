import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import {MiniHeader} from "../Headers";
import Properties from "./DetailProperties";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import EventProfilingDetails from "./EventProfilingDetails";
import EventLogDetails from "./EventLogDetails";
import ProfileLogDetails from "./ProfileLogDetails";

export default function EventDetails({data}) {
    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Event", "Context", "Raw", "Flow debug", "Flow logs", "Profile logs"]}>
                <TabCase id={0}>
                    <div className="Box10">
                        <div className="Bottom20">
                            <MiniHeader>Metadata</MiniHeader>
                            <Properties properties={data.event?.metadata}/>
                        </div>
                        <div className="Bottom20">
                            <MiniHeader>Properties</MiniHeader>
                            <Properties properties={data.event?.properties}/>
                        </div>
                        <div className="Bottom20">
                            <MiniHeader>Source</MiniHeader>
                            <Properties properties={data.event?.source}/>
                        </div>
                    </div>
                </TabCase>
                <TabCase id={1}>
                    <div className="Box10">
                        <div className="Bottom20">
                            <MiniHeader>Profile</MiniHeader>
                            <Properties properties={data.event?.profile}/>
                        </div>
                        <div className="Bottom20">
                            <MiniHeader>Page</MiniHeader>
                            <Properties properties={data.event?.session?.context?.page}/>
                        </div>
                        <div className="Bottom20">
                            <MiniHeader>Browser</MiniHeader>
                            <Properties properties={data.event?.session?.context?.browser}/>
                        </div>
                        <div className="Bottom20">
                            <MiniHeader>Screen</MiniHeader>
                            <Properties properties={data.event?.session?.context?.screen}/>
                        </div>
                        <div className="Bottom20">
                            <MiniHeader>Storage</MiniHeader>
                            <Properties properties={data.event?.session?.context?.storage}/>
                        </div>
                    </div>
                </TabCase>
                <TabCase id={2}>
                    <div className="Box10">
                        <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
                <TabCase id={3}>
                    <div style={{paddingTop: 10, height: 'inherit'}}>
                        <EventProfilingDetails eventId={data?.event?.id}/>
                    </div>
                </TabCase>
                <TabCase id={4}>
                    <div style={{paddingTop: 10, height: 'inherit'}}>
                        <EventLogDetails eventId={data?.event?.id}/>
                    </div>
                </TabCase>
                <TabCase id={5}>
                    <div style={{paddingTop: 10, height: 'inherit'}}>
                        <ProfileLogDetails profileId={data?.event?.profile?.id}
                                           sessionProfileId={data?.event?.session?.profile?.id}/>
                    </div>
                </TabCase>
            </Tabs>

        </div>
    </div>;

}

EventDetails.propTypes = {
    data: PropTypes.object,
  };