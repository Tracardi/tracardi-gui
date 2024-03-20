import React, {useState} from "react";
import {AiOutlinePlusCircle} from "react-icons/ai";
import './ListOfDottedInputs.css';
import DottedValue from "./inputs/DottedValue";
import ErrorLine from "../../errors/ErrorLine";
import DotAccessor from "./inputs/DotAccessor";


const ListOfDottedInputs = ({onChange, label = "Value", value, errorMessage, allowDuplicates=false}) => {

    const [inputValue, setInputValue] = useState('')
    const [listOfValues, setListOfValues] = useState(value || [])

    const handleAdd = () => {
        if(allowDuplicates || !listOfValues.includes(inputValue)) {
            const newValues = [...listOfValues, inputValue]
            setListOfValues(newValues)
            if(onChange) {
                onChange(newValues);
            }
        }
    }

    const handleDelete = (index) => {
        const values = listOfValues.filter((_, idx) => idx !== index);
        setListOfValues(values);
        if(onChange) {
            onChange(values);
        }
    }

    return <div className="ListOfDottedInputs">
        <div className="AddForm">
            <DotAccessor value={inputValue} label={label} onChange={setInputValue} forceMode={1}/>
            <AiOutlinePlusCircle size={30} onClick={handleAdd} style={{cursor: "pointer", marginLeft: 10, marginTop: 10}}/>
        </div>

        <fieldset style={errorMessage ? {borderColor: "red"} : {}}>
            <legend style={errorMessage ? {color: "red"} : {}}>List of values</legend>
            <div className="Values">
                {listOfValues.map((value, idx) => <DottedValue key={idx} onDelete={(_) => handleDelete(idx)}>{value}</DottedValue>)}
            </div>
        </fieldset>
        {errorMessage &&<ErrorLine style={{marginLeft: 10}}>{errorMessage}</ErrorLine>}

    </div>
}

export default ListOfDottedInputs;