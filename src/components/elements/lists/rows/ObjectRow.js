import React from "react";
import "./ObjectRow.css";
import JsonStringify from "../../misc/JsonStingify";
import Button from "../../forms/Button";
import {TiBusinessCard} from "react-icons/ti";

function StandardRow({row, timeField, filterFields, displayDetailButton, timeFieldWidth, onClick}) {

    const onDetails = () => {
        onClick(row.itemId);
    }

    const widthStyle = (typeof timeFieldWidth !== "undefined")
        ? (timeFieldWidth>0)
            ? {minWidth:timeFieldWidth, maxWidth:timeFieldWidth}
            : false
        : {}

    return <div className="EventRow">
        <div className="Header">
            {widthStyle && <div className="Timestamp" style={widthStyle}>
                <div style={{width:"100%"}}>
                    {timeField(row).map(
                        (field, index) => (<div key={index}>{field}</div>))
                    }
                </div>
                {displayDetailButton && <Button
                    label="Details"
                    icon={<TiBusinessCard size={20} style={{marginRight: 5}}/>}
                    style={{margin: 5, padding: "5px 10px"}}
                    onClick={onDetails}
                />}
            </div>}
            <div className="Data">
                <JsonStringify data={row} filterFields={filterFields}/>
            </div>
        </div>
    </div>
}

export function ObjectRow({row, timeField, onClick, filterFields, displayDetailButton, timeFieldWidth, rowDetails=null}) {

    if (rowDetails instanceof Function) {
        return <div className="EventRow">{rowDetails(row, filterFields)}</div>
    }

    return <StandardRow
        row={row}
        timeField={timeField}
        filterFields={filterFields}
        displayDetailButton={displayDetailButton}
        timeFieldWidth={timeFieldWidth}
        onClick={onClick}
    />
}

function rowsAreEqual(prevRow, nextRow) {
    return prevRow.id === nextRow.id;
}

export const MemoObjectRow = React.memo(ObjectRow, rowsAreEqual);