import React from "react";

export default function TuiColumnsFlex({children, gap = 20, width=320}) {

    const wrapper = (child) => {
        return <div style={{flexBasis: width}}>{child}</div>
    }

    return <div style={{display: "flex", gap: gap, flexWrap: "wrap"}}>
            {children && React.Children.map(children, child => (
                    wrapper(React.cloneElement(child, {style: child.props.style}))
                ))}

    </div>
}