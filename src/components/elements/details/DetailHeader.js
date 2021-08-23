import React from "react";
import PropTypes from "prop-types";
import "./DetailHeader.css";

const DetailHeader = ({ label }) => {
  return (
    <div className="DetailHeader">
      <div className="DetailLabel">{label}</div>
    </div>
  );
};

DetailHeader.propTypes = {
  label: PropTypes.string,
};

export default DetailHeader;
