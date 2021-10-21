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
        if(isError()) {
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
            }
        }
    }

    const handleDelete = (value) => {
        const values = listOfValues.filter((element) => {
            return element !== value;
        });
        setListOfValues(values);
        if(onChange) {
            onChange(values);
        }
    }

    const isError = () => {
        return id in errors;
    }

    return <div className="ListOfDottedInputs">
        <div className="AddForm">
            <DottedPathInput value={inputValue} onChange={setInputValue} width={340}/>
            <AiOutlinePlusCircle size={25} onClick={handleAdd} style={{cursor: "pointer", marginLeft: 10}}/>
        </div>

        <fieldset style={isError() ? {borderColor: "red"} : {}}>
            <legend style={isError() ? {color: "red"} : {}}>List of values</legend>
            <div className="Values">
                {listOfValues.map((value, idx) => <DottedValue key={idx} onDelete={handleDelete}>{value}</DottedValue>)}
            </div>
        </fieldset>
        <Error id={id} errors={errors}/>

    </div>
}

export default ListOfDottedInputs;