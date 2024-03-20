import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import ReportForm from "../elements/forms/ReportForm";
import {BsBarChartFill} from "react-icons/bs";


export default function Reports() {

    const urlFunc = useCallback((query) => ('/reports' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ReportForm reportId={null} onComplete={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ReportForm reportId={id} onComplete={close}/>, [])

    return <CardBrowser
        label="Reports"
        description="List of defined reports. You may filter this list by report name in the upper search box."
        urlFunc={urlFunc}
        buttonLabel="New report"
        buttonIcon={<BsBarChartFill size={20}/>}
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New report"
        drawerAddWidth={600}
        addFunc={addFunc}
        deploymentTable="report"
        deleteEndpoint="/report/"
        icon="report"
    />
}
