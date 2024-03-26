import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {resetPage} from '../../../redux/reducers/pagingSlice'
import Button from "./Button";
import "./ObjectFiltering.css";
import {AiOutlineFilter} from "react-icons/ai";
import PropTypes from 'prop-types';
import {external} from "../misc/linking"
import KqlAutoCompleteRange from "./KqlAutoCompleteRange";

export default function ObjectFiltering({type, where, onFilterClick, initRefresh, onRefreshChange}) {

    const [query, setQuery] = useState(where);

    const dispatch = useDispatch();

    function handleQueryChange(value) {
        setQuery(value);
    }

    function handleEnterPressed(ev) {
        if (ev.key === 'Enter') {
            handleReady()
        }
    }

    function handleReady() {
        dispatch(resetPage());
        onFilterClick(query)
    }

    return <section className="ObjectFiltering">
        <div className="Input">
            <KqlAutoCompleteRange index={type}
                                  value={query}
                                  refreshInterval={initRefresh}
                                  onChange={handleQueryChange}
                                  onKeyPressCapture={handleEnterPressed}
                                  onRefreshChange={onRefreshChange}

            />
            <div style={{fontSize: 12}}>Do not know how to filter. Click <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</span> for information.</div>
        </div>
        <div className="Action">
            <Button label="Filter"
                    style={{margin:"0 0 0 5px", height: 48}}
                    onClick={handleReady}
                    icon={<AiOutlineFilter size={20} style={{marginRight: 5, height: 27}}/>}/>

        </div>
    </section>
}

ObjectFiltering.propTypes = {
    type: PropTypes.string,
    where: PropTypes.string,
    onFilterClick: PropTypes.func,
    initRefresh: PropTypes.number,
    onRefreshChange: PropTypes.func
}