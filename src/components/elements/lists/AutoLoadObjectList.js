import React, {useState, useEffect, useContext} from "react";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {ObjectRow} from "./rows/ObjectRow";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import NoData from "../misc/NoData";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {FilterContext} from "../../pages/DataAnalytics";
import {DataContext} from "../../AppBox";
import {LocalDataContext} from "../../pages/DataBrowsingList";
// import {useQuery} from "react-query";

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
    const context = useContext(DataContext)
    const localContext = useContext(LocalDataContext)

    const [page, setPage] = useState(onLoadRequest?.page || 0)
    const [hasMore, setHasMode] = useState(false)
    const [total, setTotal] = useState(0)
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [allowLoadingSpinner, setAllowLoadingSpinner] = useState(true);
    const [progress, setProgress] = useState(false)
    const [refresh, setRefresh] = useState(0);
    const [lastFilter, setLastFilter] = useState(filter)
    const [lastContext, setLastContext] = useState(context)

    if(localContext) {
        onLoadRequest = {...onLoadRequest, headers: {"x-context": "production"}}
    }

    useEffect(() => {
        let timer;
        if (refreshInterval > 0) {
            setPage(0);
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

    useEffect(()=>{setPage(0)}, [localContext])

    useEffect(() => {
        let isSubscribed = true;

        setProgress(true);
        if (allowLoadingSpinner) {
            setLoading(true);
            setAllowLoadingSpinner(false);
        }

        let _page = page;
        // Condition when the page should be reset
        if(filter !== lastFilter || context !== lastContext){
            _page = 0
            setPage(_page)
        }
        setLastFilter(filter)
        setLastContext(context)

        const endpoint = {...onLoadRequest, url: `${onLoadRequest.url}/page/${page}`};

        asyncRemote(endpoint).then(response => {
            if (response) {
                if (isSubscribed) {
                    setHasMode(response.data.result.length !== 0);
                    setTotal(response.data.total);
                    setRows(_page === 0 ? [...response.data.result] : [...rows, ...response.data.result]);
                }
            }
        }).catch(e => {
            if (isSubscribed) {
                setError(e)
            }
        }).finally(() => {
            if (isSubscribed) {
                if (allowLoadingSpinner) {
                    setLoading(false);
                }
                setProgress(false);
            }
        })
        return () => isSubscribed = false;
    }, [page, refresh, filter, context, localContext]);

    // const { _isLoading, _error, _data } = useQuery('getData', () => asyncRemote(endpoint).then(response => {
    //     if (response) {
    //         setHasMode(response.data.result.length !== 0);
    //         setTotal(response.data.total);
    //         setRows(_page === 0 ? [...response.data.result] : [...rows, ...response.data.result]);
    //     }
    // }))

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

    if (loading) {
        return <CenteredCircularProgress/>;
    }

    if (error) {
        return <ErrorsBox errorList={error}/>;
    }

    if (Array.isArray(rows) && rows.length > 0) {
        return (
            <div className="ObjectList">
                {renderHeader(timeFieldLabel)}
                <div style={{height: 5}}>{progress && <LinearProgress/>}</div>
                <InfiniteScroll
                    dataLength={rows.length}
                    next={() => {
                        setPage(page + 1)
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
