import React from "react";
import "./DetailKeyValue.css";
import PropTypes from "prop-types";

const DetailKeyValue = ({label, value}) => {
    return <div className="DetailKeyValue">
        <div title={label} className="DetailKey">{label}</div>
        <div title={value} className='DetailValue'>{value}</div>
    </div>
}

DetailKeyValue.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
  };

export default DetailKeyValue;