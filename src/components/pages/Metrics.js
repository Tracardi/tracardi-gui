import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscDashboard} from "react-icons/vsc";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";
import MetricForm from "../elements/forms/MetricsForm";
import {MetricDetailsById} from "../elements/details/MetricDetails";

export default function Metrics() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/settings/metric' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <MetricForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <MetricDetailsById id={id} onDeleteComplete={close} onEditComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this metric?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/setting/metric/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const ruleCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<VscDashboard size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
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
                                           tags={[row.type]}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Profile Metrics"
        description="Profile metrics are calculated every time the profile is changed."
        urlFunc={urlFunc}
        defaultLayout="rows"
        cardFunc={ruleCards}
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
