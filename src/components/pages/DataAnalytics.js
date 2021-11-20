import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetPage, setRefreshOn, setRefreshOff } from "../../redux/reducers/pagingSlice";
import "./DataAnalytics.css";
import ObjectFiltering from "../elements/forms/ObjectFiltering";
import moment from "moment";
import DataBrowsingList from "./DataBrowsingList";
import BarChartElement from "../elements/charts/BarChart";
import { SemiHeader } from "../elements/Headers";

export default function DataAnalytics({
  type,
  label,
  onLoadDataRequest,
  onLoadHistogramRequest,
  onLoadDetails,
  detailsLabel,
  timeField,
  timeFieldLabel,
  displayDetails,
  detailsDrawerWidth,
  filterFields,
}) {
  const dispatch = useDispatch();

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
  useEffect(() => {
    let timer;
    dispatch(resetPage());
    if (refresh > 0) {
      dispatch(setRefreshOn());
      timer = setInterval(() => setQuery(encodeParams(query)), refresh * 1000);
    } else {
      dispatch(setRefreshOff());
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [refresh, query, dispatch]);

  const onFilter = ({ to, from, where }) => {
    setQuery(
      encodeParams({
        minDate: from,
        maxDate: to,
        where: where,
        limit: 30,
      })
    );
  };

  const onRefreshChange = (rate) => {
    localStorage.setItem(type + "RefreshRate", rate);
    setRefresh(rate);
  };

  function getRefreshRate() {
    const rate = localStorage.getItem(type + "RefreshRate");
    return rate ? rate : 0;
  }

  return (
    <div className="DataAnalytics">
      <div className="Filtering">
        <ObjectFiltering
          type={type}
          initDate={query}
          initRefresh={refresh}
          onFilterClick={onFilter}
          onRefreshChange={onRefreshChange}
        />
      </div>
      <div className="Data">
      <SemiHeader>{label}</SemiHeader>
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
          detailsLabel={detailsLabel}
        >
          <BarChartElement
            onLoadRequest={onLoadHistogramRequest(query)}
            columns={[{ label: "count", color: "#039be5", stackId: "count" }]}
          />
        </DataBrowsingList>
      </div>
    </div>
  );
}
