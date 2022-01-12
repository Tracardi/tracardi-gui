import React, {useState, useEffect} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {updateCounts} from "../../../redux/reducers/pagingSlice";
import AutoLoadObjectRows from "./AutoLoadObjectRows";
import {connect, useDispatch} from "react-redux";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const AutoLoadObjectList = ({
                                label,
                                timeField,
                                timeFieldLabel,
                                timeFieldWidth,
                                filterFields,
                                onLoadDetails,
                                onDetails,
                                onLoadRequest,
                                paging,
                            }) => {

    const {page, shown, total} = paging;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [allowLoadingSpinner, setAllowLoadingSpinner] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        let isSubscribed = true;
        const oldUrl = onLoadRequest.url;
        if (page > 0 || total === 0) {

            if(allowLoadingSpinner) {
                setLoading(true);
            }

            onLoadRequest.url = `${onLoadRequest.url}/page/${page}`;
            if (rows.length >= page) {
                request(
                    onLoadRequest,
                    (state) => {if(isSubscribed && allowLoadingSpinner) {setLoading(state)}},
                    (e)=> {if(isSubscribed) {setError(e)}},
                    (response) => {
                        if (response) {
                            if (isSubscribed) {
                                dispatch(updateCounts({total: response.data.total, shown: response.data.result.length}));
                                setRows(page === 0 ? [...response.data.result] : [...rows, ...response.data.result]);
                                setAllowLoadingSpinner(false);
                            }
                        }
                    }
                );
            }
        }
        return () => {
            onLoadRequest.url = oldUrl;
            isSubscribed = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total, onLoadRequest.data, dispatch]);

    const widthStyle =
        typeof timeFieldWidth !== "undefined"
            ? timeFieldWidth > 0
            ? {minWidth: timeFieldWidth, maxWidth: timeFieldWidth}
            : false
            : {};

    const header = (timeFieldLabel) => {
        let rowCountText = "";
        if (loading) {
            rowCountText = "Loading...";
        }
        if (total === 0) {
            rowCountText = "No Results";
        } else {
            rowCountText = `Showing ${shown} of ${total} total records`;
        }

        return (
            <div className="Header">
                {widthStyle && <div className="Timestamp">{timeFieldLabel}</div>}
                <div className="Data">
                    {label} - {rowCountText}
                </div>
            </div>
        );
    };

    function render(timeField, timeFieldLabel, filterFields, onDetailsRequest) {
        return (
            <div className={shown < total ? "ObjectList" : "ObjectList EndOfList"}>
                {header(timeFieldLabel)}
                <AutoLoadObjectRows
                    timeField={timeField}
                    filterFields={filterFields}
                    onDetails={onDetails}
                    onDetailsRequest={onDetailsRequest}
                    rows={rows}
                />
            </div>
        );
    }

    if (loading) {
        return <CenteredCircularProgress/>;
    }

    if (error) {
        return <ErrorsBox errorList={error}/>;
    }

    return render(timeField, timeFieldLabel, filterFields, onLoadDetails, onDetails);
};

const mapState = (state) => {
    return {
        paging: state.pagingReducer,
    };
};

export default connect(mapState)(AutoLoadObjectList);
