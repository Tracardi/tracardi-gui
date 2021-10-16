import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import "./CopyTraitsForm.css";
import DottedPathInput from "./inputs/DottedPathInput";
import { AiOutlinePlusCircle } from "@react-icons/all-files/ai/AiOutlinePlusCircle";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";

const CopyTraitsForm = ({ onChange = () => {}, value }) => {
  const [localValue, setLocalValue] = useState(value || { copy: {} });
  const [target, setTarget] = useState("");
  const [source, setSource] = useState("");
  const [task, setTask] = useState("");

  const handleAdd = (e) => {
    setLocalValue({ copy: { ...localValue.copy, [target]: source } });
    onChange(localValue);
  };

  const handleDelete = (key) => {
    const newCopy = localValue.copy;
    delete newCopy[key];
    setLocalValue({ copy: newCopy });
  };

  useEffect(() => {}, [localValue]);

  return (
    <div className="CopyTraitsForm">
      <div className="CopyTraitsInput">
        <DottedPathInput label="path" value={target} onChange={setTarget} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: "20px",
            paddingTop: "20px",
          }}
        >
          <InputLabel id="task-select">Task</InputLabel>
          <Select
            labelId="task-select"
            variant="outlined"
            size="small"
            value={task}
            defaultValue="copy"
            style={{ width: 200, justifySelf: "center" }}
            onChange={(e) => setTask(e.target.value)}
          >
            <MenuItem value="copy">Copy</MenuItem>
          </Select>
        </div>
        <DottedPathInput label="path" value={source} onChange={setSource} />
      </div>
      <AiOutlinePlusCircle size={30} onClick={handleAdd} className="Button AddButton" />

      <ul className="CopyTraitsList">
        {Object.keys(localValue.copy).map((item, i) => {
          return (
            <li key={i}>
              <p>{`${item} ${task} to: ${localValue.copy[item]}`}</p>
              <AiOutlineDelete
                size={30}
                onClick={() => {
                  handleDelete(item);
                }}
                className="Button DeleteButton"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CopyTraitsForm;
