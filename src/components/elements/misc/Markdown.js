import React from "react";
import ReactMarkdown from "react-markdown";

const Markdown = ({...props}) => {
    return <ReactMarkdown source={props.children}/>
}

export default Markdown