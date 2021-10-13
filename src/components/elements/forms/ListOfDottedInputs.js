import React, {useState} from "react";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import DottedPathInput from "./inputs/DottedPathInput";
import {AiOutlinePlusCircle} from "@react-icons/all-files/ai/AiOutlinePlusCircle";
import './ListOfDottedInputs.css';


const ListOfDottedInputs = ({onChange}) => {

    const [value, setValue] = useState("")
    const [listOfValues, setListOfValues] = useState([])

    const DottedValue = ({children, onDelete}) => {
        return <div className="DottedValue">
            <span>{children}</span>
            <VscTrash size={25} onClick={() => onDelete(children)} style={{cursor: "pointer"}}/>
        </div>
    }

    const handleAdd = () => {
        if(!listOfValues.includes(value)) {
            const newValues = [...listOfValues, value]
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
            <DottedPathInput value={value} label="Path" onChange={setValue} width={380}/>
            <AiOutlinePlusCircle size={25} onClick={handleAdd} style={{cursor: "pointer", marginLeft: 10}}/>
        </div>
        <div className="Values">
            {listOfValues.map((value, idx) => <DottedValue key={idx} onDelete={handleDelete}>{value}</DottedValue>)}
        </div>
    </div>
}

export default ListOfDottedInputs;