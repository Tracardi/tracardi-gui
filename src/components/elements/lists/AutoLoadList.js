import React, {useState, useEffect, useCallback, useRef} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import "./AutoLoadList.css";

const AutoLoadList = ({
                             label,
                             onLoadRequest,
                             renderRowFunc,
                             requestParams = {}
                         }) => {

    const [page, setPage] = useState(0)
    const [hasMore, setHasMode] = useState(false)
    const [total, setTotal] = useState(0)
    const [rows, setRows] = useState(null);
    const [error, setError] = useState(false);
    const [lastQuery, setLastQuery] = useState("")

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const loadData = useCallback((fresh = false) => {

        let endpoint;

        if (onLoadRequest?.data?.where !== lastQuery) {  // query changed, start search form beginning
            endpoint = {...onLoadRequest, url: `${onLoadRequest.url}/page/0?` + Object.keys(requestParams).map(key => `${key}=${requestParams[key]}`).join("&")};
            setLastQuery(endpoint?.data?.where);
            setPage(0);
        } else {
            endpoint = {...onLoadRequest, url: `${onLoadRequest.url}/page/${page}?` + Object.keys(requestParams).map(key => `${key}=${requestParams[key]}`).join("&")};
        }

        request(
            endpoint,
            () => {
            },
            (e) => {
                if (mounted.current === true) {
                    setError(e)
                }
            },
            (response) => {
                if (response) {
                    if (mounted.current === true) {
                        if (response.data.result.length === response.data.total) { // case of the first page being the only one, prevents from infinite loading
                            setHasMode(false);
                        } else {
                            setHasMode(response.data.result.length !== 0);
                        }
                        setTotal(response.data.total);
                        setRows((page === 0 || fresh === true) ? [...response.data.result] : [...rows, ...response.data.result]);
                    }
                }
            }
        );
    }, [page, onLoadRequest]);


    useEffect(() => {
        loadData(false);
    }, [loadData]);

    const renderHeader = () => {
        if (Array.isArray(rows)) {
            const header = `Showing ${rows.length} ${label} of ${total} total records`;

            return (
                <div className="Header">
                    {header}
                </div>
            );
        }
    };

    const renderRows = (rows) => {
        if (Array.isArray(rows)) {
            return rows.map(renderRowFunc);
        }
    };

    if (rows === null) {
        return <CenteredCircularProgress/>;
    }

    if (error) {
        return <ErrorsBox errorList={error}/>;
    }

    return (
        <div className="ObjectList">
            {renderHeader()}
            <InfiniteScroll
                dataLength={rows.length}
                next={() => {
                    setPage(page + 1)
                }}
                inverse={false}
                hasMore={hasMore}
                style={{overflow: "hidden"}}
                loader={
                    hasMore ? 
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: 4}}>
                        <CircularProgress size={20}/>
                    </div>
                    :
                    null
                }
                scrollableTarget="MainWindowScroll"
            >
                <table className="LogListTable">
                    <tbody>
                    {renderRows(rows)}
                    </tbody>
                </table>
            </InfiniteScroll>
        </div>
    );
};

export default AutoLoadList;
