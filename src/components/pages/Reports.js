import React, {useCallback, useEffect, useRef, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import AdvancedSquareCard from "../elements/lists/cards/AdvancedSquareCard";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import ReportForm from "../elements/forms/ReportForm";
import {BsBarChartFill} from "react-icons/bs";


export default function Reports() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/reports' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ReportForm reportId={null} onComplete={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ReportForm reportId={id} onComplete={close}/>, [])

    const confirm = useConfirm();

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, [])

    const onDelete = async (id) => {
        confirm({title: "Do you want to delete this report?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        const response = await asyncRemote({
                            url: `/report/${id}`,
                            method: "delete"
                        })

                        if (response && mounted.current) {
                            setRefresh(Math.random())
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const reportCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <AdvancedSquareCard key={index + "-" + subIndex}
                                                   id={row?.id}
                                                   icon={<BsBarChartFill size={45}/>}
                                                   name={row?.name}
                                                   onClick={() => onClick(row?.id)}
                                                   onEdit={_ => {}}
                                                   description={row?.description}
                                                   onDelete={onDelete}
                        />
                    })}
                </div>
            </div>
        })
    }

    const reportRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "report"}}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Reports"
        description="List of defined reports. You may filter this list by report name in the upper search box."
        urlFunc={urlFunc}
        cardFunc={reportCards}
        rowFunc={reportRows}
        buttomLabel="New report"
        buttonIcon={<BsBarChartFill size={20}/>}
        drawerDetailsTitle="Report details"
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New report"
        drawerAddWidth={600}
        addFunc={addFunc}
        refresh={refresh}
        defaultLayout={"rows"}
    />
}
