import React from 'react';
import {createMarkdown} from "safe-marked";

const markdown = createMarkdown();

export default function MarkdownElement({text}) {
    const html = markdown(text || '');
    return (<div>
        <div dangerouslySetInnerHTML={{__html: html}}/>
    </div>);
}