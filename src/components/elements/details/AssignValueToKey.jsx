import React from "react";
import PropTypes from "prop-types";
import Tag from "../misc/Tag";

const AssignValueToKey = ({label, value, op="="}) => {
    return <div className="flexLine highlightLine" style={{fontSize: 18, lineHeight: "28px", padding: "0 5px", borderRadius: 4}}>
        <div title={value} style={{padding: 3, marginRight: 10}}>{value}</div>
        <Tag backgroundColor="black" color="white">{op}</Tag>
        <div title={label} style={{padding: "3px 2px", marginLeft: 10}}>{label}</div>
    </div>
}

AssignValueToKey.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
  };

export default AssignValueToKey;