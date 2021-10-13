import Properties from "../details/DetailProperties";
import React from "react";
import FormHeader from "../misc/FormHeader";
import PropTypes from 'prop-types';

export default function RecordAddedConfirmation({payload}) {
    return <div style={{margin: 20}}>
        <FormHeader>Record added with the following data.</FormHeader>
        <div style={{color: "#444"}}>
            <Properties properties={payload}/>
        </div>
    </div>
}

RecordAddedConfirmation.propTypes = {
    payload: PropTypes.object
}