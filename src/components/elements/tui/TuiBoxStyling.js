import React, {useState} from "react";
import {isInt} from "../../../misc/typeChecking";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {BsArrowBarDown, BsArrowBarLeft, BsArrowBarRight, BsArrowBarUp} from "react-icons/bs";
import TuiColorPicker from "./TuiColorPicker";

function Dimension({value, unit = 'px', style}) {
    return <div style={{color: "black", overflow: "auto", textOverflow: "ellipsis", ...style}}>
        {value}<sup>{unit}</sup>
    </div>
}

function BoxMeasures({
                         label = '',
                         bgColor = 'rgba(128, 149, 196, 0.5)',
                         outerBorder = 'dashed 1px rgba(128, 128, 128, 0.5)',
                         outerBorderRadius = 0,
                         border = 'solid 1px #ccc',
                         borderRadius = 0,
                         dimLeft = 0,
                         dimRight = 0,
                         dimTop = 0,
                         dimBottom = 0,
                         background = "white",
                         children
                     }) {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        border: outerBorder,
        borderRadius: outerBorderRadius,
        fontSize: 12,
        backgroundColor: bgColor,
        position: "relative"
    }}>
        <div style={{height: 30, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <span style={{position: "absolute", left: 5}}>{label}</span>
            <Dimension value={dimTop}/>
        </div>
        <div style={{height: "calc(100% - 60px)", display: "flex"}}>
            <div style={{width: 50, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Dimension value={dimLeft}/>
            </div>
            <div style={{
                width: "calc(100% - 100px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: border,
                borderRadius: borderRadius,
                background: background
            }}>
                {children}
            </div>
            <div style={{width: 50, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Dimension value={dimRight}/>
            </div>
        </div>
        <div style={{height: 30, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Dimension value={dimBottom}/>
        </div>
    </div>
}

export function BoxStylingInfo({
                                   border = 'solid 4px #ccc',
                                   width = 0,
                                   height = 0,
                                   borderRadius = 0,
                                   margin = {left: 0, top: 0, right: 0, bottom: 0},
                                   padding = {left: 0, top: 0, right: 0, bottom: 0},
                               }) {
    return <div style={{width: 400, height: 200, margin: 10}}>
        <BoxMeasures borderRadius={borderRadius} border={border} label="MARGIN"
                     dimLeft={margin.left} dimBottom={margin.bottom} dimRight={margin.right} dimTop={margin.top}
        >
            <BoxMeasures
                label="PADDING"
                bgColor="#fff9c4"
                outerBorder={"none"}
                outerBorderRadius={borderRadius}
                border={"1px dashed #ccc"}
                dimLeft={padding.left} dimBottom={padding.bottom} dimRight={padding.right} dimTop={padding.top}
            >
                <Dimension value={width} style={{marginRight: 5}}/> x <Dimension value={height}
                                                                                 style={{marginLeft: 5}}/>
            </BoxMeasures>
        </BoxMeasures>
    </div>
}

function BoxPixelInput({label, value, icon, onChange, outline=true}) {
    const [iconColor, setIconColor] = useState("rgba(0, 0, 0, 0.30)")

    const handleChange = (e) => {
        if (onChange instanceof Function) {
            const number = parseInt(e.target.value)
            if (!isInt(number)) {
                onChange(0)
            } else {
                onChange(number)
            }
        }
    }

    const AdornmentIcon = () => {
        if(outline) {
            return <span style={{
                border: "2px solid " + iconColor,
                borderRadius: 3,
                width: 24,
                height: 23,
                color: iconColor
            }}>{icon}</span>
        }

        return icon

    }

    return <TextField label={label}
                      variant="standard"
                      onFocusCapture={() => setIconColor("#1976d2")}
                      onBlurCapture={() => setIconColor("rgba(0, 0, 0, 0.30)")}
                      size="small"
                      InputProps={{
                          startAdornment: icon ? <InputAdornment position="start"><AdornmentIcon/></InputAdornment> : null,
                          endAdornment: <InputAdornment position="end"><sup
                              style={{color: iconColor}}>px</sup></InputAdornment>
                      }}
                      value={value}
                      onChange={handleChange}
                      inputProps={{min: 0, style: {textAlign: 'right', height: 30}}}
                      style={{width: 100, margin: 7}}
    />
}

function BoxDimensionsForm({
                               label,
                               top = 0, left = 0, right = 0, bottom = 0,
                               onChange
                           }) {

    const [dim, setDim] = useState({
        left, right, top, bottom
    })

    const handleChange = (value) => {
        setDim(value)
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    return <fieldset style={{margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
        <legend>{label}</legend>
        <BoxPixelInput value={top} label="Top" icon={<BsArrowBarUp size={20}/>}
                     onChange={(v) => handleChange({...dim, top: v})}/>
        <BoxPixelInput value={right} label="Right" icon={<BsArrowBarRight size={20}/>}
                     onChange={(v) => handleChange({...dim, right: v})}/>
        <BoxPixelInput value={bottom} label="Bottom" icon={<BsArrowBarDown size={20}/>}
                     onChange={(v) => handleChange({...dim, bottom: v})}/>
        <BoxPixelInput value={left} label="Left" icon={<BsArrowBarLeft size={20}/>}
                     onChange={(v) => handleChange({...dim, left: v})}/>
    </fieldset>
}

function BoxStylingForm({value, onChange}) {

    const [styling, setStyling] = useState(value || {
        margin: {
            left: 0, top: 0, right: 0, bottom: 0
        },
        padding: {
            left: 0, top: 0, right: 0, bottom: 0
        },
        color: {
            background: "rgba(229,229,229,0.9)",
            text: "rgba(0,0,0,1)"
        },
        border: {
            radius: 0,
            size: 0,
            color: "rgba(0,0,0,1)"
        }
    })

    const handleChange = (v) => {
        setStyling(v)
        if (onChange instanceof Function) {
            onChange(v)
        }
    }

    return <div style={{width: "100%", display: "flex", flexDirection: "column"}}>
        <div style={{margin: "8px 0"}}>Margins & Padding</div>
        <BoxDimensionsForm label="Margin"
                           top={styling?.margin?.top}
                           bottom={styling?.margin?.bottom}
                           left={styling?.margin?.left}
                           right={styling?.margin?.right}
                           onChange={(v) => handleChange({...styling, margin: v})}
        />
        <BoxDimensionsForm label="Padding"
                           top={styling?.padding?.top}
                           bottom={styling?.padding?.bottom}
                           left={styling?.padding?.left}
                           right={styling?.padding?.right}
                           onChange={(v) => handleChange({...styling, padding: v})}/>
        <div style={{margin: "8px 0"}}>Border settings</div>
        <fieldset>
            <legend>Border</legend>
            <BoxPixelInput value={styling?.border?.radius} label="Radius"
                           onChange={(v) => handleChange({...styling, border: {...styling.border, radius: v}})}/>
            <BoxPixelInput value={styling?.border?.size} label="Size"
                           onChange={(v) => handleChange({...styling, border: {...styling.border, size: v}})}/>
        </fieldset>


        <div style={{margin: "8px 0"}}>Color settings</div>
        <div style={{display: "flex"}}>
            <div>
                <TuiColorPicker label="Text color" value={styling?.color?.text}
                                style={{margin: "10px 5px"}}
                                onChange={(v) => handleChange({...styling, color: {...styling.color, text: v}})}
                />
                <TuiColorPicker label="Background color" value={styling?.color?.background}
                                style={{margin: "10px 5px"}}
                                onChange={(v) => handleChange({...styling, color: {...styling.color, background: v}})}
                />
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: styling?.color?.background,
                color: styling?.color?.text,
                width: 190,
                borderRadius: 10
            }}>Text
            </div>
        </div>

    </div>
}

export default function BoxStyling({value, onChange}) {

    const [styling, setStyling] = useState(value || {
        margin: {
            left: 0, top: 0, right: 0, bottom: 0
        },
        padding: {
            left: 0, top: 0, right: 0, bottom: 0
        },
        color: {
            background: "rgba(229,229,229,0.9)",
            text: "rgba(0,0,0,1)"
        },
        width: "auto",
        height: "auto",
        border: {
            radius: 0,
            size: 0,
            color: "rgba(0,0,0,1)"
        }
    })

    const handleChange = (v) => {
        setStyling(v)
        if (onChange instanceof Function) {
            onChange(v)
        }
    }

    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: 500}}>
        <BoxStylingInfo margin={styling?.margin}
                        padding={styling?.padding}
                        width={styling?.width}
                        height={styling?.height}
                        border={`solid ${styling?.border?.size}px #ccc`}
                        borderRadius={styling?.border?.radius}
        />
        <BoxStylingForm value={value}
                        onChange={handleChange}/>
    </div>
}