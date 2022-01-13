import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import { VscTrash } from "react-icons/vsc";
import "./KeyValueForm.css";

const KeyValueForm = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || {});
  const [key, setKey] = useState("");
  const [val, setVal] = useState("");

  useEffect(() => {}, [localValue]);

  const handleAdd = () => {
    if (key.length > 0 && val.length > 0) {
      const newValue = { ...localValue, [key]: val }
      setLocalValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
      setKey("");
      setVal("");
    }
  };

  const handleDelete = (item) => {
    const newCopy = localValue;
    delete newCopy[item];
    setLocalValue({ ...newCopy });
  };

  return (
    <div className="KeyValueForm">
      <div className="KeyValueInput">
        <TextField
          variant="outlined"
          type="text"
          size="small"
          label="Key"
          onChange={(e) => {
            setKey(e.target.value);
          }}
          style={{ marginRight: 8, flexGrow: 1 }}
          value={key}
        />
        <TextField
          variant="outlined"
          type="text"
          size="small"
          label="Value"
          onChange={(e) => {
            setVal(e.target.value);
          }}
          value={val}
          style={{ marginRight: 8, flexGrow: 1 }}
        />
        <AiOutlinePlusCircle size={25} onClick={handleAdd} className="Button AddButton" style={{cursor: "pointer"}}/>
      </div>
      <fieldset style={{height: 130, overflowY: "auto", margin:"5px 0"}}>
        <legend>List of key-value pairs</legend>
        <ul className="KeyValueList">
          {Object.keys(localValue).map((item, i) => {
            return (
              <li key={i}>
                {`${item}: ${localValue[item]}`}
                <VscTrash
                  size={25}
                  onClick={() => {
                    handleDelete(item);
                  }}
                  className="Button DeleteButton"
                  style={{ marginLeft: 12, cursor: "pointer" }}
                />
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
};

export default KeyValueForm;
