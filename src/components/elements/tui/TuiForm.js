import React from "react";
import "./TuiForm.css";

export const TuiForm = ({children, className, style}) => {

    let baseClassName = ["TuiForm"]

    if(className) {
        baseClassName.push(className)
    }
    return <form className={baseClassName.join(" ")} style={style}>
        {children}
    </form>
}

export const TuiFormGroup = ({children, className, style}) => {

    let baseClassName = ["TuiFormGroup"]

    if(className) {
        baseClassName.push(className)
    }
    return <div className={baseClassName.join(" ")} style={style}>
        {children}
    </div>
}

export const TuiFormGroupHeader = ({className, style, header, description=null}) => {

    let baseClassName = ["TuiFormGroupHeader"]

    if(className) {
        baseClassName.push(className)
    }
    return <div className={baseClassName.join(" ")} style={style}>
        <h2>{header}</h2>
        {description && <p>{description}</p>}
    </div>
}

export const TuiFormGroupContent = ({children, className, style, header=null, description=null}) => {

    let baseClassName = ["TuiFormGroupContent"]
    let baseStyle =  {overflowY: "auto"}

    if(className) {
        baseClassName.push(className)
    }

    if(style) {
        baseStyle = {...baseStyle, ...style}
    }

    return <section className={baseClassName.join(" ")} style={baseStyle}>
        {header && <h3>{header}</h3>}
        {description && <p>{description}</p>}
        {children}
    </section>
}


