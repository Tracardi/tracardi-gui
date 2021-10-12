import React, {useState} from "react";
import "./ObjectRow.css";
import JsonStringify from "../../misc/JsonStingify";
import Button from "../../forms/Button";
import {TiBusinessCard} from "@react-icons/all-files/ti/TiBusinessCard";
import {BsArrowsExpand} from "@react-icons/all-files/bs/BsArrowsExpand";
import {BsArrowsCollapse} from "@react-icons/all-files/bs/BsArrowsCollapse";

export function ObjectRow({row, timeField, onClick, filterFields, displayDetailButton, timeFieldWidth}) {

    const [toggle, setToggle] = useState(false);

    const widthStyle = (typeof timeFieldWidth !== "undefined")
        ? (timeFieldWidth>0)
            ? {minWidth:timeFieldWidth, maxWidth:timeFieldWidth}
            : false
        : {}

    const renderToggleIcon = () => {
        return (toggle) ? <BsArrowsCollapse size={30}/> : <BsArrowsExpand size={30}/>;
    }

    const toggleIcon = () => {
        setToggle(!toggle);
    }

    const onDetails = () => {
        onClick(row.itemId);
    }

    return <div className="EventRow">
        <div className="Header">
            <div className="Toggle" onClick={toggleIcon}><span style={{border: "solid 1px gray"}}>{renderToggleIcon()}</span></div>
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
                <JsonStringify data={row} filter={(!toggle) ? filterFields: []} unfold={toggle}/>
            </div>
        </div>
    </div>
}

function rowsAreEqual(prevRow, nextRow) {
    return prevRow.id === nextRow.id;
}

export const MemoObjectRow = React.memo(ObjectRow, rowsAreEqual);