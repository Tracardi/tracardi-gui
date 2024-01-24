import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscDashboard} from "react-icons/vsc";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import MetricForm from "../elements/forms/MetricsForm";
import {MetricDetailsById} from "../elements/details/MetricDetails";
import {useRequest} from "../../remote_api/requestClient";

export default function Metrics() {

    const [refresh, setRefresh] = useState(0);
    const {request} = useRequest()

    const urlFunc = useCallback((query) => ('/settings/metric' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <MetricForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <MetricDetailsById id={id} onDeleteComplete={close} onEditComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this metric?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/setting/metric/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const ruleRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "metric"}}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           deplomentTable="metrics"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Profile Metrics Computations"
        description="Profile metrics are calculated from event data whenever new events are added or changes are made to the profile, or on a regular basis."
        urlFunc={urlFunc}
        defaultLayout="rows"
        rowFunc={ruleRows}
        buttonLabel="New metric"
        buttonIcon={<VscDashboard size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New metric"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
