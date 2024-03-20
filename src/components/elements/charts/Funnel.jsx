import React, {useEffect, useRef} from "react";
// import FunnelGraph from "funnel-graph-js";
import './Funnel.css';

function InnerFunnelGraph({width, height}) {

    const data = {
        labels: [
            "Awareness",
            "Consideration",
            "Purchase",
            "Loyalty",
            "Advocacy"

        ],
        subLabels: ["Web", "Call Center", "Facebook"],
        colors: [
            ["#FFB178", "#FF78B1", "#FF3C8E"],
            ["#A0BBFF", "#EC77FF"],
            ["#A0F9FF", "#7795FF"],
            ["#A0F9FF", "#7795FF"]
        ],
        values: [
            [2000, 1451, 5000],
            [2500, 1400, 1023],
            [2500, 1000, 1023],
            [400, 200, 119],
            [100, 40, 22]
        ]
    };
    const funnel = useRef(null)

    useEffect(() => {
        funnel.current.innerHTML = ''
        const graph = new FunnelGraph({
            container: "#Funnel",
            gradientDirection: "vertical",
            data: data,
            displayPercent: true,
            direction: "vertical",
            width: width,
            height: height,
            subLabelValue: "percent"
        });
        graph.draw();
    }, []);

    return <div id="Funnel" ref={funnel}/>;
}

export default function Funnel({width=300, height=800}) {
    return <div style={{height: height + 70}}><InnerFunnelGraph width={width} height={height}/></div>
}