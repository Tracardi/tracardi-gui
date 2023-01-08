import React, {useState} from "react";
import {v4 as uuid4} from 'uuid';
import {BsTrash} from "react-icons/bs";
import Button from "./Button";
import {objectMap} from "../../../misc/mappers";


const ListOfForms = ({onChange, form, value:_value, defaultFormValue={}}) => {

    if(!_value) {
        _value = {[uuid4()]: defaultFormValue}
    } else {
        if (Array.isArray(_value)) {
            const valueObj = {};

            for (const item of _value) {
                valueObj[uuid4()] = item;
            }

            _value = valueObj
        }

    }

    console.log("val", _value)

    const [list, setList] = useState(_value)

    const handleChange = (list) => {
        if(onChange instanceof Function) {
            onChange(list)
        }
    }

    const handleRowAdd = () => {
        const _list = {...list, [uuid4()]: defaultFormValue}
        setList(_list)
        handleChange(_list)
    }

    const handleRowChange = (key, value) => {
        const _list= {...list, [key]: value}
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
                return <div key={key} style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <span>
                        {
                            React.createElement(
                                form,
                                {value: formValue, onChange: (value) => handleRowChange(key, value)},
                                null
                            )}
                        </span><BsTrash size={20} style={{cursor: "pointer"}} onClick={() => handleDelete(key)}/>
                </div>
            })
        }
        <Button label="Add" onClick={handleRowAdd}/>

    </div>
}

export default ListOfForms;
