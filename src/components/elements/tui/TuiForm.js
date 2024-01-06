import React from "react";
import "./TuiForm.css";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import useTheme from "@mui/material/styles/useTheme";

export const TuiForm = ({children, className, style}) => {

    let baseClassName = ["TuiForm"]

    const onSubmit = e => {
        // that's for the form not to reload after hitting Enter on the keyboard while focused on empty field.
        e.preventDefault();
    }

    if(className) {
        baseClassName.push(className)
    }

    return <form className={baseClassName.join(" ")} style={style} onSubmit={onSubmit}>
        {children}
    </form>
}

export const TuiFormGroup = ({children, className, style, fitHeight=false}) => {

    let baseClassName = ["TuiFormGroup"]

    if(className) {
        baseClassName.push(className)
    }

    if(fitHeight === true) {
        if(isEmptyObjectOrNull(style)) {
            style = {}
        }
        style['height'] = "100%"
    }

    return <div className={baseClassName.join(" ")} style={style}>
        {children}
    </div>
}

export const TuiFormGroupHeader = ({className, style, header, description=null}) => {

    const theme = useTheme()

    let baseClassName = ["TuiFormGroupHeader"]

    if(className) {
        baseClassName.push(className)
    }

    style = {
        ...style, backgroundColor: theme.palette.form.group.header
    }

    return <div className={baseClassName.join(" ")} style={style}>
        <h2>{header}</h2>
        {description && <p>{description}</p>}
    </div>
}

export const TuiFormGroupContent = ({children, className, style, name, description}) => {

    let baseClassName = ["TuiFormGroupContent"]
    let baseStyle =  {overflowY: "auto"}
    const theme = useTheme()

    if(className) {
        baseClassName.push(className)
    }

    if(style) {
        baseStyle = {...baseStyle, ...style}
    }

    baseStyle = {
        ...baseStyle,
        backgroundColor: theme.palette.form.group.background,
        color: theme.palette.common.black
    }

    return <section className={baseClassName.join(" ")} style={baseStyle}>
        {name && <h2>{name}</h2>}
        {description && <p>{description}</p>}
        {children}
    </section>
}

export const TuiFormGroupField = ({children, header=null, description=null}) => {
    return <>
        {header && <h3>{header}</h3>}
        {description && <p className="flexLine" style={{flexWrap: "wrap"}}>{description}</p>}
        {children}
    </>
}



