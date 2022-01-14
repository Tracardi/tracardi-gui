import React, {useState} from "react";
import DottedPathInput from "./inputs/DottedPathInput";
import {AiOutlinePlusCircle} from "react-icons/ai";
import './ListOfDottedInputs.css';
import DottedValue from "./inputs/DottedValue";
import ErrorLine from "../../errors/ErrorLine";


const ListOfDottedInputs = ({onChange, value, errorMessage, defaultMode}) => {

    const [inputValue, setInputValue] = useState('')
    const [listOfValues, setListOfValues] = useState(value || [])

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

    return <div className="ListOfDottedInputs">
        <div className="AddForm">
            <DottedPathInput value={inputValue} onChange={setInputValue} width={300} defaultMode={defaultMode}/>
            <AiOutlinePlusCircle size={25} onClick={handleAdd} style={{cursor: "pointer", marginLeft: 10}}/>
        </div>

        <fieldset style={errorMessage ? {borderColor: "red"} : {}}>
            <legend style={errorMessage ? {color: "red"} : {}}>List of values</legend>
            <div className="Values">
                {listOfValues.map((value, idx) => <DottedValue key={idx} onDelete={handleDelete}>{value}</DottedValue>)}
            </div>
        </fieldset>
        {errorMessage &&<ErrorLine style={{marginLeft: 10}}>{errorMessage}</ErrorLine>}

    </div>
}

export default ListOfDottedInputs;