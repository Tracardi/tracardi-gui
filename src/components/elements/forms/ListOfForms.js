import React, {useState} from "react";
import {v4 as uuid4} from 'uuid';
import {SlClose} from "react-icons/sl";
import Button from "./Button";
import {objectMap} from "../../../misc/mappers";
import "./ListOfForms.css";


const ListOfForms = ({
                         onChange, label = "Add",
                         form,
                         details,
                         style,
                         value: _value,
                         defaultFormValue = {},
                         justify = "space-between",
                         width,
                         align = "left",
                         separator = false,
                         initEmpty=false
                     }
) => {

    let initCurrentRow
    const buttonMargin = (align === 'left') ? {marginLeft: 10} : {marginRight: 10}
    const alignButtons = (align === 'left')
        ? "row-reverse"
        : (align === "right")
            ? "row"
            : (align === "top")
                ? "column"
                : "column-reverse"

    const alignDelete = (align === 'left')
        ? "row-reverse"
        : (align === "right")
            ? "row"
            : (align === "top")
                ? "row-reveres"
                : "row"
    if(initEmpty) {
        _value = {}
    } else if (!_value) {
        initCurrentRow = uuid4()
        _value = {[initCurrentRow]: defaultFormValue}
    } else {
        if (Array.isArray(_value)) {
            const valueObj = {};
            for (const item of _value) {
                initCurrentRow = uuid4()
                valueObj[initCurrentRow] = item;
            }

            _value = valueObj
        }

    }

    const [list, setList] = useState(_value)
    const [currentRow, setCurrentRow] = useState(initCurrentRow)

    const handleChange = (list) => {
        if (onChange instanceof Function) {
            onChange(Object.values(list))
        }
    }

    const handleSetCurrent = (e, value) => {
        setCurrentRow(value)
        e.stopPropagation()
    }


    const handleRowAdd = () => {
        const _currentRow = uuid4()
        const _list = {...list, [_currentRow]: defaultFormValue}
        setList(_list)
        setCurrentRow(_currentRow)
        handleChange(_list)
    }

    const handleRowChange = (key, value) => {
        const _list = {...list, [key]: value}
        setList(_list)
        handleChange(_list)
    }

    const handleDelete = (key) => {
        const deleteItem = (key, current) => {
            const {[key]: undefined, ...list} = current;
            return list;
        }
        const _list = deleteItem(key, list)
        setList(_list)
        handleChange(_list)
    }

    style = {
        width: "100%",
        display: "flex",
        flexDirection: alignDelete,
        alignItems: "center",
        justifyContent: justify,
        gap: 15,
        borderBottom: separator ? "dashed 1px rgba(128,128,128,0.5)" : "dashed 1px transparent",
        marginBottom: separator ? 10 : 0,
        ...style
    }
    return <div style={{width: "100%", display: "flex", marginBottom: 10, flexDirection: alignButtons}} className="FormRow">
        {onChange instanceof Function && <div style={{display: "flex", ...buttonMargin}}>
            <Button label={label} onClick={handleRowAdd}/>
        </div>}
        <div style={{width: "100%"}}>
            {
                objectMap(list, (key, formValue) => {
                    return <div key={key} style={style} className="FormFieldRow">
                        <span style={{width: width || "100%"}} onClick={(e) => handleSetCurrent(e, key)}>
                        {
                            (currentRow !== key && details) ? <span style={{cursor: "pointer"}}>{React.createElement(
                                details,
                                {value: formValue},
                                null
                            )}</span> : React.createElement(
                                form,
                                {value: formValue, onChange: (value) => handleRowChange(key, value)},
                                null
                            )
                        }
                        </span>
                        {onChange instanceof Function &&
                            <SlClose size={24} style={{cursor: "pointer"}} onClick={() => handleDelete(key)}/>}
                    </div>
                })
            }
        </div>


    </div>
}

export default ListOfForms;