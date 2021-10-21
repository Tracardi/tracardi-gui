import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "@react-icons/all-files/ai/AiOutlinePlusCircle";
import TextField from "@material-ui/core/TextField";
import { VscTrash } from "@react-icons/all-files/vsc/VscTrash";
import "./KeyValueForm.css";

const KeyValueForm = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || {});
  const [key, setKey] = useState("");
  const [val, setVal] = useState("");

  useEffect(() => {}, [localValue]);

  const handleAdd = () => {
    if (key.length > 0 && val.length > 0) {
      setLocalValue({ ...localValue, [key]: val });
      if (onChange) {
        onChange(localValue);
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
        <AiOutlinePlusCircle size={30} onClick={handleAdd} className="Button AddButton" />
      </div>
      <fieldset>
        <legend>Key / Value Pairs</legend>
        <ul className="KeyValueList">
          {Object.keys(localValue).map((item, i) => {
            return (
              <li key={i}>
                {`${item}: ${localValue[item]}`}
                <VscTrash
                  size={30}
                  onClick={() => {
                    handleDelete(item);
                  }}
                  className="Button DeleteButton"
                  style={{ marginLeft: 12 }}
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
