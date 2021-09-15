import WhenChips from "../forms/NewRuleForm/WhenChips";
import ThenChips from "../forms/NewRuleForm/ThenChips";
import React from "react";
import './UqlDetails.css';
import PropTypes from "prop-types";

const UqlDetails = ({data}) => {

    const trigger = "event.type=\""+ data.event?.type + "\""+ ((data.source?.id) ? " AND source.id="+data.source?.id : "")

    const Condition = () => <React.Fragment>When <WhenChips condition={trigger}/></React.Fragment>
    const Actions = () => <React.Fragment>Trigger <ThenChips actions={[data.flow?.name]}/></React.Fragment>

    const RenderChips = () => {
        if (typeof data !== "undefined") {
            return <div className="UqlChips">
                <Condition/><br /><Actions/>
            </div>
        }
        return "";
    }

    return <RenderChips/>;
}

UqlDetails.propTypes = {
    data: PropTypes.object,
  };

export default UqlDetails;