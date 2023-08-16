import React, {useState} from "react";
import {v4 as uuid4} from 'uuid';
import {SlClose} from "react-icons/sl";
import Button from "./Button";
import {objectMap} from "../../../misc/mappers";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {FieldBox} from "./FieldBox";

function BinaryOperation({value, label, onChange}) {

    const handleChange = (ev) => {
        if(onChange instanceof Function) {
            onChange(ev.target.value)
        }
    }

    return <TextField
        select
        variant="outlined"
        size="small"
        label={label || "Operation"}
        value={value || "and"}
        style={{width: 150}}
        onChange={handleChange}
    >
        <MenuItem value={"and"} selected>AND</MenuItem>
        <MenuItem value={"or"}>OR</MenuItem>
    </TextField>
}
const QueryRuleGroup = ({onChange, label="Add Rule", form, details, style, value: _value, defaultFormValue = {}}) => {

    let initCurrentRow

    if (!_value) {
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 15,
        ...style
    }

    return <div style={{width: "100%"}}>


        <div className="flexLine">
            <FieldBox><BinaryOperation /></FieldBox>
            <Button label="Add rule" onClick={handleRowAdd}/>
            <Button label="Add group" />
        </div>
        {
            objectMap(list, (key, formValue) => {
                return <div key={key} style={style}>
                        <span style={{width: "100%"}} onClick={(e) => handleSetCurrent(e, key)}>
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
                    {onChange instanceof Function && <SlClose size={24} style={{cursor: "pointer"}} onClick={() => handleDelete(key)}/>}
                </div>
            })
        }
    </div>
}

export default QueryRuleGroup;
