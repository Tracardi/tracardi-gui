import React, {useState} from "react";
import "./DataAnalytics.css";
import ObjectFiltering from "../elements/forms/ObjectFiltering";
import moment from "moment";
import DataBrowsingList from "./DataBrowsingList";
import BarChartElement from "../elements/charts/BarChart";
import {isString} from "../../misc/typeChecking";

export default function DataAnalytics({
                                          type,
                                          label,
                                          onLoadDataRequest,
                                          onLoadHistogramRequest,
                                          onLoadDetails,
                                          timeField,
                                          timeFieldLabel,
                                          displayDetails,
                                          detailsDrawerWidth,
                                          filterFields,
                                          displayChart = true,
                                          barChartColors = {}
                                      }) {

    const getQuery = (type, label) => {
        const key = type + label;
        let storedData;
        storedData = localStorage.getItem(key);
        if (typeof storedData === "undefined" || storedData === "undefined" || !storedData) {
            storedData = "";
            localStorage.setItem(key, storedData);
        }

        return storedData;
    };

    const getSavedData = (type, label) => {
        const key = type + label;
        let storedData;
        try {
            storedData = JSON.parse(localStorage.getItem(key));
        } catch (SyntaxError) {
            storedData = null;
        }

        if (!storedData) {
            const now = moment();

            const initDate = {
                absolute: {
                    year: now.format("YYYY"),
                    month: now.format("MM"),
                    meridiem: now.format("a"),
                    date: now.format("DD"),
                    hour: now.format("hh"),
                    minute: now.format("mm"),
                    second: now.format("ss"),
                },
                delta: {
                    type: null,
                    value: null,
                    entity: null,
                },
                now: null,
            };

            if (label === "DateTo") {
                initDate.absolute = null;
                initDate.delta = null;
            }

            if (label === "DateFrom") {
                initDate.delta = {
                    type: "minus",
                    value: -15,
                    entity: "day",
                };
            }

            localStorage.setItem(key, JSON.stringify(initDate));
            storedData = initDate;
        }
        return storedData;
    };

    const encodeParams = (init) => {
        return {
            ...init,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            rand: Math.random().toString(),
        };
    };

    const [refresh, setRefresh] = useState(getRefreshRate());
    const [query, setQuery] = useState(
        encodeParams({
            minDate: getSavedData(type, "DateFrom"),
            maxDate: getSavedData(type, "DateTo"),
            where: getQuery(type, "Query"),
            limit: 30,
        })
    );

    const onFilter = ({to, from, where}) => {
        setQuery(
            encodeParams({
                minDate: from,
                maxDate: to,
                where: where,
                limit: 30,
            })
        );
    };

    const handleRefreshChange = (rate) => {
        localStorage.setItem(type + "RefreshRate", rate);
        setRefresh(rate);
    };

    function getRefreshRate() {
        let rate = localStorage.getItem(type + "RefreshRate");
        if(isString(rate)) {
            const value = parseInt(rate)
            if(!isNaN(value)) {
                rate = value
            }
        }
        return rate ? rate : 0;
    }

    return (
        <div className="DataAnalytics">
                <ObjectFiltering
                    type={type}
                    initDate={query}
                    initRefresh={refresh}
                    onFilterClick={onFilter}
                    onRefreshChange={handleRefreshChange}
                />
            <div className="Data">
                <DataBrowsingList
                    label={label}
                    onLoadDataRequest={onLoadDataRequest}
                    onLoadHistogramRequest={onLoadHistogramRequest}
                    onLoadDetails={onLoadDetails}
                    timeFieldLabel={timeFieldLabel}
                    filterFields={filterFields}
                    timeField={timeField}
                    initQuery={query}
                    displayDetails={displayDetails}
                    detailsDrawerWidth={detailsDrawerWidth}
                    displayChart={displayChart}
                    refreshInterval={refresh}
                >
                  <BarChartElement
                        onLoadRequest={onLoadHistogramRequest(query)}
                        refreshInterval={refresh}
                        barChartColors = {barChartColors}
                  />
                </DataBrowsingList>
            </div>
        </div>
    );
}
