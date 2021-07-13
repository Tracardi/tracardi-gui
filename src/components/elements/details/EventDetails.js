import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import {MiniHeader} from "../Headers";
import Properties from "./DetailProperties";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";

export default function EventDetails({data}) {
    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Event", "Context", "Result", "Raw", "Process"]}>
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
                        <div className="Box10">
                            <div className="Bottom20">
                                <MiniHeader>Session</MiniHeader>
                                <Properties properties={data.result?.session}/>
                            </div>
                            <div className="Bottom20">
                                <MiniHeader>Profile</MiniHeader>
                                <Properties properties={data.result?.profile}/>
                            </div>
                            <div className="Bottom20">
                                <MiniHeader>Events</MiniHeader>
                                <Properties properties={data.result?.events}/>
                            </div>
                            <div className="Bottom20">
                                <MiniHeader>Rules</MiniHeader>
                                <Properties properties={data.result?.rules}/>
                            </div>
                            <div className="Bottom20">
                                <MiniHeader>Segments</MiniHeader>
                                <Properties properties={data.result?.segments}/>
                            </div>
                        </div>
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