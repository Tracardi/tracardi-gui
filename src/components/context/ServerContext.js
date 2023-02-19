import React, {useContext, useState} from "react";
import {DataContext} from "../AppBox";

const ServerContext = ({style, onContextChange}) => {

    const context = useContext(DataContext)
    const [production, setProduction] = useState(context)


    function handleOnClick(value) {
        setProduction(value)
        if(onContextChange instanceof Function) {
            onContextChange(value)
        }

    }

    function display() {
        if (production) {
            return <span className="Context" style={{backgroundColor: "white", color: "black"}}
                         onClick={() => handleOnClick(false)}>production</span>
        } else {
            return <span className="Context" style={{backgroundColor: "white", color: "black"}}
                         onClick={() => handleOnClick(true)}>development</span>
        }
    }


    return <span style={style}>{display()}</span>
}

export default ServerContext;