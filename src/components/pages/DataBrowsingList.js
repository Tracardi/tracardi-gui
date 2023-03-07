import React, {createContext, useContext, useState} from "react";
import "./DataAnalytics.css";
import "./DataBrowsingList.css";
import DetailsObjectList from "../elements/lists/DetailsObjectList";
import ServerContextBar from "../context/ServerContextBar";
import {DataContext} from "../AppBox";

export const LocalDataContext = createContext(null);

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
        rowDetails = null
    }) {


    const [localProductionContext, setLocalProductionContext] = useState(false)
    const globalProductionContext = useContext(DataContext)

    const handleLocalContextChange = (event, state) => {
        state = (state === "production")
        setLocalProductionContext(state)
    }

    return <LocalDataContext.Provider value={localProductionContext}>
        <section className="DataBrowsingList">
            <div style={{display: "flex", justifyContent: "center"}}>
                {!globalProductionContext && <ServerContextBar context={localProductionContext}
                                                               onContextChange={handleLocalContextChange}/>}
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
    </LocalDataContext.Provider>
}