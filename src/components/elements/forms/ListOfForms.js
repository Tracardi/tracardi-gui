import React, {useState} from "react";
import {v4 as uuid4} from 'uuid';
import {BsTrash} from "react-icons/bs";
import Button from "./Button";
import {objectMap} from "../../../misc/mappers";


const ListOfForms = ({onChange, form, details, value: _value, defaultFormValue = {}}) => {

    const initCurrentRow = uuid4()

    if (!_value) {
        _value = {[initCurrentRow]: defaultFormValue}
    } else {
        if (Array.isArray(_value)) {
            const valueObj = {};

            for (const item of _value) {
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
        e.preventDefault()
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

    return <div style={{width: "100%"}}>
        {
            objectMap(list, (key, formValue) => {
                return <div key={key} style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 15
                }}>
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
                        </span><BsTrash size={20} style={{cursor: "pointer"}} onClick={() => handleDelete(key)}/>
                </div>
            })
        }
        <div style={{margin: "20px 0"}}>
            <Button label="Add" onClick={handleRowAdd}/>
        </div>


    </div>
}

export default ListOfForms;
