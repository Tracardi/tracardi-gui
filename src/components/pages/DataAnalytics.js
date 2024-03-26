import React, {useState, createContext} from "react";
import "./DataAnalytics.css";
import ObjectFiltering from "../elements/forms/ObjectFiltering";
import DataBrowsingList from "./DataBrowsingList";
import BarChartElement from "../elements/charts/BarChart";
import {isString} from "../../misc/typeChecking";

export const FilterContext = createContext(0);
const max = 364 + 24 + 60

export default function DataAnalytics({
                                          type,
                                          label,
                                          onLoadDataRequest: onLoadRequest,
                                          onLoadHistogramRequest,
                                          onLoadDetails,
                                          timeField,
                                          timeFieldLabel,
                                          rowDetails = null,
                                          displayDetails,
                                          detailsDrawerWidth,
                                          filterFields,
                                          displayChart = true,
                                          barChartColors = {},
                                          ExtensionDropDown = null
                                      }) {

    const [filterNumber, setFilterNumber] = useState(0)

    const getSavedData = (type, label) => {
        const key = type + label;
        let storedData;
        try {
            storedData = JSON.parse(localStorage.getItem(key));
        } catch (SyntaxError) {
            storedData = null;
        }
        return storedData;
    };

    const savedData = (type, label, value) => {
        const key = type + label;
        localStorage.setItem(key, JSON.stringify(value));
    };

    const convertSliderValue = (value) => {
        if (value === max) {
            return null;
        } else if (value >= 364 + 24 && value < max) {
            return {type: "minus", value: -(max - value), entity: "minute"}
        } else if (value >= 364 && value < 364 + 24) {
            return {type: "minus", value: -(max - value - 60), entity: "hour"}
        } else {
            return {type: "minus", value: -(max - value - 60 - 24), entity: "day"}
        }
    }

    const addTimeZone = (init) => {
        return {
            ...init,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            rand: Math.random().toString(),
        };
    };

    const _range = () => getSavedData(type, "Range") || [364, max]
    const _minDate = () => getSavedData(type, "DateFrom") || convertSliderValue(_range[0])
    const _maxDate = () => getSavedData(type, "DateTo") || convertSliderValue(_range[1])

    const [refresh, setRefresh] = useState(getRefreshRate());
    const [range, setRange] = useState(_range())
    const [query, setQuery] = useState(
        addTimeZone({
            minDate: _minDate(),
            maxDate: _maxDate(),
            where: getSavedData(type, "Query") || "",
            limit: 30,
        })
    );

    const handleFilter = (where) => {
        savedData(type, "Query", where);
        setFilterNumber(filterNumber + 1)
        setQuery(addTimeZone({
            minDate: _minDate(),
            maxDate: _maxDate(),
            where: where,
            limit: 30,
        }));
    };


    const handleRangeChange = (range) => {
        setRange(range)

        const maxDate = convertSliderValue(range[1])
        const minDate = convertSliderValue(range[0])

        setQuery(addTimeZone({
            minDate: {
                absolute: null,
                delta: minDate
            },
            maxDate: {
                absolute: null,
                delta: maxDate
            },
            where: query.where,
            limit: 30,
        }));

        savedData(type ,"DateTo", {
            absolute: null,
            delta: maxDate
        });
        savedData(type, "DateFrom", {
            absolute: null,
            delta: minDate
        });
        savedData(type ,"Range", range);

        setFilterNumber(filterNumber + 1)

    }

    const handleRefreshChange = (rate) => {
        localStorage.setItem(type + "RefreshRate", rate);
        setRefresh(rate);
    };

    function getRefreshRate() {
        let rate = localStorage.getItem(type + "RefreshRate");
        if (isString(rate)) {
            const value = parseInt(rate)
            if (!isNaN(value)) {
                rate = value
            }
        }
        return rate ? rate : 0;
    }

    return (
        <FilterContext.Provider value={filterNumber}>
            <div className="DataAnalytics">
                <ObjectFiltering
                    type={type}
                    where={query?.where}
                    initRefresh={refresh}
                    onFilterClick={handleFilter}
                    onRefreshChange={handleRefreshChange}
                />
                <div className="Data">
                    <DataBrowsingList
                        label={label}
                        onLoadRequest={onLoadRequest}
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
                        rowDetails={rowDetails}
                        ExtensionDropDown={ExtensionDropDown}
                    >
                        <BarChartElement
                            onLoadRequest={onLoadHistogramRequest(query)}
                            refreshInterval={refresh}
                            barChartColors={barChartColors}
                            rangeValue={range}
                            onRangeChange={handleRangeChange}
                        />
                    </DataBrowsingList>
                </div>
            </div>
        </FilterContext.Provider>
    );
}
