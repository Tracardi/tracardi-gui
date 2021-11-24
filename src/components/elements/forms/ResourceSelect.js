import AutoComplete from "./AutoComplete";
import React from "react";

export default function ResourceSelect({value=null, placeholder = "Resource", onChange = () => {} }) {

    const handleChange = (value) => {
        onChange(value);
    };

    return <>
        <AutoComplete disabled={false}
                      solo={false}
                      placeholder={placeholder}
                      url="/resources"
                      initValue={value}
                      onSetValue={handleChange}
                      onDataLoaded={
                          (result) => {
                              if (result) {
                                  let sources = [{id: "", name: ""}]
                                  for (const source of result?.data?.result) {
                                      if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                          sources.push({name: source.name, id: source.id})
                                      }
                                  }
                                  return sources
                              }
                          }
                      }/>
    </>
}