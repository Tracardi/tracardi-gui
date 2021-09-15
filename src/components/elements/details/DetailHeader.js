import React from "react";
import "./DetailHeader.css";
import PropTypes from "prop-types";


const DetailHeader = ({label}) => {
    return <div className="DetailHeader">
            <div className="DetailLabel">{label}</div>
        </div>
}

DetailHeader.propTypes = {
    label: PropTypes.string,
  };

export default DetailHeader;