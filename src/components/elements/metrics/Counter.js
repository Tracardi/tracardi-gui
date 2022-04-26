import React from "react";

export default function Counter({label, value, subValue, subValueSuffix = "",width=120}) {
    console.log(label, typeof(value), value, abbreviateNumber(value))
    function round(num, places) {
        return +(Math.round(num + "e+" + places) + "e-" + places);
    }

    function abbreviateNumber(value) {
        let newValue = value;
        if (value >= 1000) {
            let suffixes = ["", "k", "m", "b", "t"];
            let suffixNum = Math.floor(("" + value).length / 3);
            let shortValue = '';
            for (let precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                if (dotLessShortValue.length <= 2) {
                    break;
                }
            }
            if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
            newValue = shortValue + suffixes[suffixNum];
            return newValue
        }
        return round(newValue, 3);
    }

    return <div style={{width: width, padding: 15, margin: "0px 5px", fontFamily: "Lato"}}>
        <div style={{fontWeight: 400}}>{label}</div>
        <div style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "200%",
            color: "#1976d2",
            fontWeight: 800
        }}>{abbreviateNumber(value)}</div>
        {subValue && <div style={{fontSize: "80%", textAlign: "center"}}>{round(subValue,3)} {subValueSuffix}</div>}
    </div>
}