import React from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import NotImplemented from "../misc/NotImplemented";


export default function SessionDetails({data}) {


    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Session"]}>
                <TabCase id={0}>
                    <TuiForm style={{padding: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Session time-line"/>
                            <TuiFormGroupContent>
                                <NotImplemented>Not implemented</NotImplemented>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
            </Tabs>

        </div>
    </div>;

}

SessionDetails.propTypes = {
    data: PropTypes.object,
  };