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
        onLoadRequest,
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
        ExtensionDropDown

    }) {

    const globalProductionContext = useContext(DataContext)

    return <section className="DataBrowsingList">
        <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
            {!globalProductionContext && <ServerContextBar extensions={ExtensionDropDown}
            />}
        </div>

        {displayChart === true && <div className="Chart">
            {children}
        </div>}
        <div className="Data">
            <DetailsObjectList
                label={label}
                onLoadRequest={onLoadRequest(initQuery)}
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