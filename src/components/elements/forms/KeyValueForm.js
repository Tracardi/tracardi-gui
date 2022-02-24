import React, {useRef, useState} from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { VscTrash } from "react-icons/vsc";
import "./KeyValueForm.css";
import DotAccessor from "./inputs/DotAccessor";
import Button from "./Button";

const KeyValueForm = ({ value, onChange, defaultKeySource, defaultValueSource, lockKeySource}) => {

  const [localValue, setLocalValue] = useState(value || {});

  const key = useRef("")
  const val = useRef("");

  const handleAdd = () => {
    if (key.current.length > 0 && val.current.length > 0) {
      const newValue = { ...localValue, [key.current]: val.current }
      setLocalValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleDelete = (item) => {
    const newCopy = localValue;
    delete newCopy[item];
    setLocalValue({ ...newCopy });
  };

  const handleKeyChange = (value) => {
    key.current = value;
  }
  const handleValueChange = (value) => {
    val.current = value;
  }

  return (
    <div className="KeyValueForm">
      <div className="KeyValueInput">
        <div>Key:</div>
        <DotAccessor label="Key" value={key.current} onChange={handleKeyChange} defaultSourceValue={defaultKeySource} lockSource={lockKeySource}/>
        <div style={{marginTop: 10}}>Value:</div>
        <DotAccessor label="Value" value={val.current} onChange={handleValueChange} defaultSourceValue={defaultValueSource}/>

      </div>
      <div style={{marginTop: 10, display: "flex"}}>
        <Button icon={<AiOutlinePlusCircle size={25} style={{marginRight: 10}}/>}
                onClick={handleAdd}
                label="Add Key-Value Pair"/>
      </div>

      <fieldset style={{height: 160, overflowY: "auto", margin:"5px 0"}}>
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
