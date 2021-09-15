import React from "react";
import "./DataAnalytics.css";
import DetailsObjectList from "../elements/lists/DetailsObjectList";

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
        detailsLabel
    }) {

    return <section>
        <div>
            {children}
        </div>
        <div>
            <DetailsObjectList
                label={label}
                onLoadRequest={onLoadDataRequest(initQuery)}
                onLoadDetails={onLoadDetails}
                filterFields={filterFields}
                timeField={timeField}
                timeFieldLabel={timeFieldLabel}
                displayDetails={displayDetails}
                detailsDrawerWidth={detailsDrawerWidth}
                detailsLabel={detailsLabel}
            />
        </div>
    </section>
}