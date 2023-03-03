import React from "react";
import PropTypes from "prop-types";
import Tag from "../misc/Tag";

const AssignValueToKey = ({label, value}) => {
    return <div className="flexLine" style={{fontSize: 20}}>
        <div title={value} style={{padding: 5}}>{value}</div>
        <Tag backgroundColor="black" color="white">=</Tag>
        <div title={label} style={{padding: "5px 2px"}}>{label}</div>
    </div>
}

AssignValueToKey.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
  };

export default AssignValueToKey;