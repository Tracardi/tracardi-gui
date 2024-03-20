import React from "react";

const ServerContextTag = ({style, context, onContextChange,
                           productionStyle={backgroundColor: "white", color: "black"},
                           stagingStyle={backgroundColor: "white", color: "black"}}) => {

    function handleOnClick(value) {
        if (onContextChange instanceof Function) {
            onContextChange(value)
        }
    }

    function display() {
        return <span style={context ? productionStyle : stagingStyle}
                     onClick={() => handleOnClick(!context)}>{context ? "production" : "sand-box"}</span>
    }


    return <span style={style}>{display()}</span>
}

export default ServerContextTag;