import AutoComplete from "../forms/AutoComplete";
import React from "react";
import {open} from '../../../redux/reducers/newResource';
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../../misc/UrlPrefix";

function TuiSelectResource({value = null, disabled = false, errorMessage = null, onSetValue = null, tag = null, open}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    const handleNewResource = () => {
        open();
    }

    const resourceUrl = tag ? "/resources/entity/tag/"+tag : "/resources/entity"

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    return <div>
        <AutoComplete disabled={disabled}
                      solo={false}
                      placeholder="Resource"
                      url={resourceUrl}
                      initValue={value}
                      error={errorMessage}
                      onSetValue={handleValueSet}
                      onDataLoaded={
                          (result) => {
                              if (result) {
                                  let sources = []
                                  for (const source of result?.data?.result) {
                                      if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                          sources.push({name: source.name, id: source.id})
                                      }
                                  }
                                  return sources
                              }
                          }
                      }/>
        <div style={{marginTop: 8, color: "#444"}}>If the list is empty (not loading) you need to add resource  <span
            onClick={handleNewResource} style={{textDecoration: "underline", cursor: "pointer"}}>click here</span>.
            Remember to select the resource tagged: <b>{tag}</b>.  For editing the source go to <span
                onClick={go("/traffic")} style={{textDecoration: "underline", cursor: "pointer"}}>Resource page</span>
        </div>
    </div>
}

export default connect(
    null,
    {open}
)(TuiSelectResource)