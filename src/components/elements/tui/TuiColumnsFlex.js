import React from "react";
import  "./TuiColumnsFlex.css";

export default function TuiColumnsFlex({children, style, width=320}) {

    const wrapper = (child) => {
        return <div style={{flexBasis: width}}>{child}</div>
    }

    return <div className="TuiColumnFlex" style={style}>
            {children && React.Children.map(children, child => (
                    wrapper(React.cloneElement(child, {style: child.props.style}))
                ))}

    </div>
}