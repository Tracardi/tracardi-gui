import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import {MiniHeader} from "../Headers";
import DetailHeader from "./DetailHeader";
import "./Details.css";
import Properties from "./DetailProperties";
import Tabs, {TabCase} from "../tabs/Tabs";
import DataBrowsingList from "../../pages/DataBrowsingList";
import LineChartElement from "../charts/LineChart";

export default function ProfileDetails({data}) {

    const filterQuery = {
        minDate: {
            delta: {
                type: "minus",
                value: -1,
                entity: "week"
            }
        },
        where: 'profile.id="' + data.id + '"',
        limit: 10
    }

    const encodeParams = () => {
        return {
            ...filterQuery,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            rand: Math.random().toString()
        };
    }

    const query = encodeParams();

    const onLoadEventDataRequest = (filterQuery) => {
        return {
            url: '/event/select/range',
            method: "post",
            data: filterQuery
        }
    }
    const onLoadEventHistogramRequest = (filterQuery) => {
        return {
            url: '/event/select/histogram',
            method: "post",
            data: filterQuery
        }
    }

    const onLoadSessionHistogramRequest = (filterQuery) => {
        return {
            url: '/session/select/histogram',
            method: "post",
            data: filterQuery
        }
    }

    const onLoadSessionDataRequest = (filterQuery) => {
        return {
            url: '/session/select/range',
            method: "post",
            data: filterQuery
        }
    }

    return <div style={{height: "inherit"}}>
        <DetailHeader label={data.id}/>
        <div className="RightTabScroller">

            <Tabs tabs={["Properties", "Segments", "Events", "Sessions", "Raw"]}>
                <TabCase id={0}>
                    <div className="Box10">
                        <MiniHeader>Properties</MiniHeader>
                        <Properties properties={data.properties}/>
                    </div>
                </TabCase>
                <TabCase id={1}>
                    <div className="Box10">
                        <Properties properties={data.segments}/>
                    </div>
                </TabCase>
                <TabCase id={2}>
                    <DataBrowsingList
                        onLoadDataRequest={onLoadEventDataRequest}
                        timeFieldLabel="timestamp"
                        filterFields={['metadata.time.utc']}
                        timeField={(row) => [row.metadata.time.utc]}
                        initQuery={query}
                    >
                        <LineChartElement onLoadRequest={onLoadEventHistogramRequest(query)}
                                          columns={[{label: "events", color: "#039be5", stackId: "events"}]}/>
                    </DataBrowsingList>
                </TabCase>
                <TabCase id={3}>
                    <DataBrowsingList
                        onLoadDataRequest={onLoadSessionDataRequest}
                        timeFieldLabel="timestamp"
                        filterFields={['metadata.time.utc']}
                        timeField={(row) => [row.metadata.time.utc]}
                        initQuery={query}
                    >
                        <LineChartElement onLoadRequest={onLoadSessionHistogramRequest(query)}
                                          columns={[{label: "events", color: "#039be5", stackId: "events"}]}/>
                    </DataBrowsingList>
                </TabCase>
                <TabCase id={4}>
                    <div className="Box10">
                        <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs>
        </div>
    </div>;

}