import ObjectRow from "./rows/ObjectRow";
import ErrorBox from "../../errors/ErrorBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import React from "react";

const ObjectList = ({data, loading, errors, timeField, timeFieldLabel, timeFieldWidth, filterFields, onLoadDetails, onDetails}) => {

    const widthStyle = (typeof timeFieldWidth !== "undefined")
        ? (timeFieldWidth>0)
            ? {minWidth:timeFieldWidth, maxWidth:timeFieldWidth}
            : false
        : {}

    const header = (timeFieldLabel, data) => {
        return <div className="Header">
            {widthStyle && <div className="Timestamp">{timeFieldLabel}</div>}
            <div className="Data">Data - Total {data.total} records</div>
        </div>
    }

    const rows = (timeField, filterFields, data, onDetailsRequest, onDetails) => {
        if(Array.isArray(data.result)) {
            return data.result.map(
                (row, index) => {
                    return <ObjectRow key={index}
                                      row={row}
                                      timeField={timeField}
                                      timeFieldWidth={timeFieldWidth}
                                      filterFields={filterFields}
                                      onClick={() => { onDetails(row.id); } }
                                      displayDetailButton={typeof onDetailsRequest !== "undefined"}
                    />
                }
            )
        }
    }

    function render (data, loading, errors, timeField, timeFieldLabel, filterFields, onDetailsRequest) {

        if(errors !== false) {
            return <ErrorBox errorList={errors}/>
        }

        if(loading === true) {
            return <CenteredCircularProgress/>
        } else {
            if(data) {
                return <div className="ObjectList">
                    {header(timeFieldLabel, data, onDetailsRequest)}
                    {rows(timeField, filterFields, data, onDetailsRequest, onDetails)}
                </div>
            } else {
                return "";
            }
        }
    }

    return render(data, loading, errors, timeField, timeFieldLabel, filterFields, onLoadDetails, onDetails);
}

export default ObjectList;