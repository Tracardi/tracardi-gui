import React, {useEffect} from 'react';
import {request} from "../../remote_api/uql_api_endpoint";
import Input from "./forms/inputs/Input";
import "./StandardFilteredList.css";
import ErrorsBox from "../errors/ErrorsBox";
import CenteredCircularProgress from "./progress/CenteredCircularProgress";
import Button from "./forms/Button";

export function StandardFilteredList({
                                         filterLabel,
                                         filterKey,
                                         endPoinyUrl,
                                         renderList,
                                         newButtonLabel,
                                         newButtonIcon,
                                         newButtonOnClick
                                     }) {

    const filterValue = localStorage.getItem(filterKey)

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState((filterValue) ? filterValue : "");
    const [inputError, setInputError] = React.useState(false);
    const [rerender, setReRender] = React.useState(0);

    const fetchData = (withLoading) => {

        return () => {

            let load = () => {
            }

            if (withLoading) {
                load = (value) => {
                    setLoading(value);
                    setInputError(false)
                }
            }

            request(
                {
                    url: endPoinyUrl,
                    method: "post",
                    data: {
                        where: searchQuery,
                        limit: 20
                    }
                },
                load,
                (value) => {
                    setError(value);
                    setInputError(true)
                },
                (value) => {
                    setReady(value);
                    setInputError(false)
                },
                withLoading
            );
        }

    }
    useEffect(() => {
        fetchData(true)();
    }, [searchQuery, rerender]);

    useEffect(() => {
        const interval = setInterval(fetchData(false), 5000);
        return () => clearInterval(interval);
    }, [])

    const onSearch = (value) => {
        localStorage.setItem(filterKey, value);
        setSearchQuery(value);
        setReRender(Math.random());
    }

    const render = () => {
        if (error !== false) {
            return <ErrorsBox errorList={error}/>
        } else if (ready !== false) {
            return renderList(ready.data)
        } else if (loading) {
            return <CenteredCircularProgress/>
        }
    }

    return (
        <div className="StandardFilteredList">
            <div className="StandardFilterInput">
                <div className="StandardFilter">
                    <Input label={filterLabel}
                           onEnterPressed={onSearch}
                           initValue={searchQuery}
                           style={{width: "100%"}}
                           error={inputError}
                           variant="outlined"
                    />
                </div>
                <div className="StandardAdd">
                    <Button label={newButtonLabel}
                            icon={newButtonIcon}
                            onClick={newButtonOnClick}
                    />
                </div>
            </div>
            <div className="StandardFilterList">
                {render()}
            </div>
        </div>
    );

}

export default StandardFilteredList;
