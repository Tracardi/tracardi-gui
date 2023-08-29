import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import {asyncRemote} from "../../remote_api/entrypoint";
import {useConfirm} from "material-ui-confirm";
import SchedulerJobDetails from "../elements/details/SchedulerJobDetails";
// import SchedulerJobForm from "../elements/forms/SchedulerJobForm";

export default function Scheduler() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/scheduler/jobs' + ((query) ? "?query=" + query : "")), [])
    // const addFunc = useCallback((close) => <SchedulerJobForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <SchedulerJobDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this scheduled event?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/scheduler/job/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const cards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<FlowNodeIcons icon="calendar" size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "calendar"}}
                                           onDelete={handleDelete}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Scheduler"
        description="Scheduler triggers event at defined time intervals. This is commercial feature. "
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        // buttonLabel="New schedule"
        // buttonIcon={<FlowNodeIcons icon="calendar"/>}
        drawerDetailsWidth={800}
        // drawerAddTitle="New schedule"
        drawerAddWidth={800}
        detailsFunc={detailsFunc}
        // addFunc={addFunc}
        className="Pad10"
        noDataInfo="Currently there are no tasks scheduled."
    />

}
