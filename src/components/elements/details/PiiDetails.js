import React from "react";
import "./PiiDetails.css"

const PiiDetails = ({profile}) => {
    return <div className="PiiDetails">
        {profile?.data?.pii?.firstname} {profile?.data?.pii?.lastname ? profile?.data?.pii?.lastname : "Anonymous"}
        {profile?.data?.contact?.email?.main && <span style={{marginLeft: 10}}>({profile?.data.contact.email?.main })</span>}
    </div>
}

export default PiiDetails;