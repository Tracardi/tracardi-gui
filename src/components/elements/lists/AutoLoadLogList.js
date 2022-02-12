import React, {useState, useEffect, useCallback, useRef} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import "./AutoLoadLogList.css";

const AutoLoadLogList = ({
                             label,
                             onLoadRequest,
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
            endpoint = {...onLoadRequest, url: `${onLoadRequest.url}/page/0`};
            setLastQuery(endpoint?.data?.where);
            setPage(0);
        } else {
            endpoint = {...onLoadRequest, url: `${onLoadRequest.url}/page/${page}`};
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
                        setHasMode(response.data.result.length !== 0);
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
            return rows.map((row, index) => {
                return (
                    <tr key={index} className="LogListRow">
                        <td>{row.date}</td>
                        <td>{row.level}</td>
                        <td>{row.message}</td>
                        <td>{row.file}</td>
                        <td>{row.line}</td>
                    </tr>
                );
            });
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
                loader={<div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: 4}}>
                    <CircularProgress size={20}/></div>}
                scrollableTarget="MainWindowScroll"
            >
                <table className="LogListTable">
                    {renderRows(rows)}
                </table>
            </InfiniteScroll>
        </div>
    );
};

export default AutoLoadLogList;
