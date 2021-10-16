import React, {useState} from "react";
import DottedPathInput from "./inputs/DottedPathInput";
import {AiOutlinePlusCircle} from "@react-icons/all-files/ai/AiOutlinePlusCircle";
import './ListOfDottedInputs.css';
import DottedValue from "./inputs/DottedValue";
import ErrorLine from "../../errors/ErrorLine";


const ListOfDottedInputs = ({id, onChange, value, errors}) => {

    const [inputValue, setInputValue] = useState('')
    const [listOfValues, setListOfValues] = useState(value || [])

    const Error = ({id, errors}) => {
        if(Array.isArray(errors) && id in errors) {
            return <ErrorLine style={{marginLeft: 10}}>{errors[id]}</ErrorLine>
        }
        return ""
    }

    const handleAdd = () => {
        if(!listOfValues.includes(inputValue)) {
            const newValues = [...listOfValues, inputValue]
            setListOfValues(newValues)
            if(onChange) {
                onChange(newValues);
                console.log("new", newValues )
            }
        }
    }

    const handleDelete = (value) => {
        const values = listOfValues.filter((element) => {
            return element !== value;
        });
        setListOfValues(values)
    }

    return <div className="ListOfDottedInputs">
        <div className="AddForm">
            <DottedPathInput value={inputValue} label="Path" onChange={setInputValue} width={380}/>
            <AiOutlinePlusCircle size={25} onClick={handleAdd} style={{cursor: "pointer", marginLeft: 10}}/>
        </div>
        <Error id={id} errors={errors}/>
        <div className="Values">
            {listOfValues.map((value, idx) => <DottedValue key={idx} onDelete={handleDelete}>{value}</DottedValue>)}
        </div>

    </div>
}

export default ListOfDottedInputs;