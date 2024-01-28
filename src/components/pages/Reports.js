import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import ReportForm from "../elements/forms/ReportForm";
import {BsBarChartFill} from "react-icons/bs";


export default function Reports() {

    const urlFunc = useCallback((query) => ('/reports' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ReportForm reportId={null} onComplete={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ReportForm reportId={id} onComplete={close}/>, [])

    const reportRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "report"}}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="report"
                                           deleteEndpoint="/report/"
                                           icon="report"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Reports"
        description="List of defined reports. You may filter this list by report name in the upper search box."
        urlFunc={urlFunc}
        rowFunc={reportRows}
        buttonLabel="New report"
        buttonIcon={<BsBarChartFill size={20}/>}
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New report"
        drawerAddWidth={600}
        addFunc={addFunc}
        defaultLayout="rows"
    />
}
