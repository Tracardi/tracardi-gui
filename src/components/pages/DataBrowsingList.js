import React, {useContext} from "react";
import "./DataAnalytics.css";
import "./DataBrowsingList.css";
import DetailsObjectList from "../elements/lists/DetailsObjectList";
import ServerContextBar from "../context/ServerContextBar";
import {DataContext} from "../AppBox";


export default function DataBrowsingList(
    {
        label,
        children,
        onLoadDataRequest,
        onLoadDetails,
        timeField,
        timeFieldLabel,
        filterFields,
        initQuery,
        displayDetails,
        detailsDrawerWidth,
        displayChart = true,
        refreshInterval = 0,
        rowDetails = null,
        localContext,
        onLocalContextChange,
        ExtensionDropDown

    }) {

    const globalProductionContext = useContext(DataContext)

    return <section className="DataBrowsingList">
        <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
            {!globalProductionContext && <ServerContextBar context={localContext}
                                                           onContextChange={onLocalContextChange}
                                                           extensions={ExtensionDropDown}
            />}
        </div>

        {displayChart === true && <div className="Chart">
            {children}
        </div>}
        <div className="Data">
            <DetailsObjectList
                label={label}
                onLoadRequest={onLoadDataRequest(initQuery)}
                onLoadDetails={onLoadDetails}
                filterFields={filterFields}
                timeField={timeField}
                timeFieldLabel={timeFieldLabel}
                displayDetails={displayDetails}
                detailsDrawerWidth={detailsDrawerWidth}
                refreshInterval={refreshInterval}
                rowDetails={rowDetails}
            />
        </div>

    </section>
}