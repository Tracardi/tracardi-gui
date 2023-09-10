import React, {useState, useEffect, useContext, useRef} from "react";
import {ObjectRow} from "./rows/ObjectRow";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import NoData from "../misc/NoData";
import {FilterContext, LocalDataContext} from "../../pages/DataAnalytics";
import {DataContext} from "../../AppBox";
import {useFetch} from "../../../remote_api/remoteState";

const AutoLoadObjectList = ({
                                label,
                                timeField,
                                timeFieldLabel,
                                timeFieldWidth,
                                filterFields,
                                onLoadDetails,
                                onDetails,
                                onLoadRequest,
                                refreshInterval = 0,
                                rowDetails = null
                            }) => {

    const filter = useContext(FilterContext);
    const context = useContext(DataContext);
    const localContext = useContext(LocalDataContext);

    const page = useRef(0)
    const lastFilter = useRef(filter)
    const lastContext = useRef(context)
    const lastLocalContext = useRef(localContext)

    const [hasMore, setHasMode] = useState(false)
    const [total, setTotal] = useState(0)
    const [rows, setRows] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        let timer;
        if (refreshInterval > 0) {
            page.current = 0;
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(() => {setRefresh(Math.random())}, refreshInterval * 1000);
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [refreshInterval]);

     const {isLoading: loading, error} = useFetch(
        ["getData", [refresh, filter, context, localContext]],
        () => {
            if(filter !== lastFilter.current) {
                lastFilter.current = filter
                page.current = 0
            }
            if(context !== lastContext.current) {
                lastContext.current = context
                page.current = 0
            }
            if(localContext !== lastLocalContext.current) {
                lastLocalContext.current = localContext
                page.current = 0
            }
            return {...onLoadRequest, url: `${onLoadRequest.url}/page/${page.current}`}
        },
        data => {
            setHasMode(data.result.length !== 0)
            setTotal(data.total)
            setRows(page.current === 0 ? [...data.result] : [...rows, ...data.result])
            return data
        },
         {
             retry: 1
         })

    const widthStyle =
        typeof timeFieldWidth !== "undefined"
            ? timeFieldWidth > 0
            ? {minWidth: timeFieldWidth, maxWidth: timeFieldWidth}
            : false
            : {};

    const renderHeader = (timeFieldLabel) => {
        const rowCountText = `Showing ${rows.length} of ${total} total records`;

        return (
            <div className="Header">
                {widthStyle && <div className="Timestamp">{timeFieldLabel}</div>}
                <div className="Data">
                    {label} - {rowCountText}
                </div>
            </div>
        );
    };

    const renderRows = (rows) => {
        if (Array.isArray(rows)) {
            return rows.map((row, index) => {
                return (
                    <ObjectRow
                        key={index}
                        row={row}
                        timeField={timeField}
                        timeFieldWidth={timeFieldWidth}
                        filterFields={filterFields}
                        onClick={() => {
                            onDetails(row.id);
                        }}
                        rowDetails={rowDetails}
                        displayDetailButton={typeof onLoadDetails !== "undefined"}
                    />
                );
            });
        }
    };

    if (error) {
        return <NoData header="Query error">
            <p>Your query is incorrect. Server returned: <b>{error.data?.detail}</b></p>
        </NoData>
    }

    if (Array.isArray(rows) && rows.length > 0) {
        return (
            <div className="ObjectList">
                {renderHeader(timeFieldLabel)}
                <div style={{height: 5}}>{loading && <LinearProgress/>}</div>
                <InfiniteScroll
                    dataLength={rows.length}
                    next={() => {
                        page.current = page.current + 1
                        setRefresh(Math.random())
                    }}
                    inverse={false}
                    hasMore={hasMore && refreshInterval === 0}
                    style={{overflow: "hidden"}}
                    loader={<div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: 4}}>
                        <CircularProgress size={20}/></div>}
                    scrollableTarget="MainWindowScroll"
                >
                    {renderRows(rows)}
                </InfiniteScroll>
            </div>)
    } else {
        return <NoData header="No data found">
            <p>Please extend the time range or change the filtering.</p>
        </NoData>
    }
};

export default AutoLoadObjectList;
