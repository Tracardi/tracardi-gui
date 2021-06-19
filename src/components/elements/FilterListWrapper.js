import React, {useEffect} from 'react';
import {request} from "../../remote_api/uql_api_endpoint";
import Input from "./forms/inputs/Input";
import "./FilterListWrapper.css";
import ErrorBox from "../errors/ErrorBox";
import CenteredCircularProgress from "./progress/CenteredCircularProgress";

export function FilterListWrapper({filterLabel, filterKey, endPoinyUrl, renderList, forceReload}) {

    const filterValue = localStorage.getItem(filterKey)

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState((filterValue) ? filterValue : "");
    const [inputError, setInputError] = React.useState(false);
    const [rerender, setReRender] = React.useState(0);

    const fetchData = (withLoading) => {

        return () => {

            let load = () => { }

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

        const interval = setInterval(fetchData(false), 5000);
        return () => clearInterval(interval);

    }, [searchQuery, rerender, forceReload])

    const onSearch = (value) => {
        localStorage.setItem(filterKey, value);
        setSearchQuery(value);
        setReRender(Math.random());
    }

    const render = () => {
        if (error !== false) {
            return <ErrorBox errorList={error}/>
        } else if (ready !== false) {
            return renderList(ready.data)
        } else if (loading) {
            return <CenteredCircularProgress/>
        }
    }

    return (

        <div className="FilterListWrapper">
            <div className="FilterInput">
                <Input label={filterLabel}
                       onEnterPressed={onSearch}
                       initValue={searchQuery}
                       style={{width: "100%"}}
                       error={inputError}
                       variant="outlined"
                />
            </div>

            <div className="FilterList">
                {render()}
            </div>
        </div>
    );

}

export default FilterListWrapper;
