import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import {MiniHeader} from "../Headers";
import "./Details.css";
import Properties from "./DetailProperties";
import Tabs, {TabCase} from "../tabs/Tabs";
import DataBrowsingList from "../../pages/DataBrowsingList";
import LineChartElement from "../charts/LineChart";
import PropTypes from "prop-types";
import PiiDetails from "./PiiDetails";
import HeatMap from "@uiw/react-heat-map";
// import HeatMap from "@uiw/react-heat-map";
// import Tooltip from '@uiw/react-tooltip';

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
        limit: 30
    }

    const encodeParams = () => {
        return {
            ...filterQuery,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            rand: Math.random().toString()
        };
    }

    const query = encodeParams();

    // const onLoadEventDataRequest = (filterQuery) => {
    //     return {
    //         url: '/event/select/range',
    //         method: "post",
    //         data: filterQuery
    //     }
    // }
    // const onLoadEventHistogramRequest = (filterQuery) => {
    //     return {
    //         url: '/event/select/histogram',
    //         method: "post",
    //         data: filterQuery
    //     }
    // }

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
        <PiiDetails pii={data.pii}/>
        <div className="RightTabScroller">

            <Tabs tabs={["Traits", "Segments", "Events", "Sessions", "Raw"]}>
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
                        <HeatMap value={[
                            { date: '2016/01/11', count:2 },
                            ...[...Array(17)].map((_, idx) => ({ date: `2016/01/${idx + 10}`, count: idx })),
                            ...[...Array(17)].map((_, idx) => ({ date: `2016/02/${idx + 10}`, count: idx })),
                            { date: '2016/04/12', count:2 },
                            { date: '2016/05/01', count:5 },
                            { date: '2016/05/02', count:5 },
                            { date: '2016/05/03', count:1 },
                            { date: '2016/05/04', count:11 },
                            { date: '2016/05/08', count:32 },
                            { date: '2016/11/08', count:32 },
                        ]}
                                 startDate={new Date('2016/01/01')}
                                 width={1150}
                                 height={180}
                                 rectSize={18}
                                 rectProps={{
                                     rx: 10
                                 }}
                                 panelColors={{
                                     0: '#b3e5fc',
                                     2: '#4fc3f7',
                                     4: '#03a9f4',
                                     10: '#0288d1',
                                     20: '#1976d2',
                                     30: '#0d47a1',
                                     50: '#002171',
                                     100: '#000'
                                 }}
                                 space = {3}
                                 legendRender={()=>{}}

                        />
                    </div>
                    {/*<DataBrowsingList*/}
                    {/*    label="List of Profiles"*/}
                    {/*    onLoadDataRequest={onLoadEventDataRequest}*/}
                    {/*    timeFieldLabel="timestamp"*/}
                    {/*    filterFields={['metadata.time.utc']}*/}
                    {/*    timeField={(row) => [row.metadata.time.utc]}*/}
                    {/*    initQuery={query}*/}
                    {/*>*/}
                    {/*    <LineChartElement onLoadRequest={onLoadEventHistogramRequest(query)}*/}
                    {/*                      columns={[{label: "events", color: "#039be5", stackId: "events"}]}/>*/}
                    {/*</DataBrowsingList>*/}
                </TabCase>
                <TabCase id={3}>
                    <DataBrowsingList
                        label="List of Sessions"
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

ProfileDetails.propTypes = {
    data: PropTypes.object,
  };