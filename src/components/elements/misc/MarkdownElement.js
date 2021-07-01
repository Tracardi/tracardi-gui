import React from 'react';
import { createMarkdown } from "safe-marked";
const markdown = createMarkdown();

export default class MarkdownElement extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { text } = this.props,
            html = markdown(text || '');

        return (<div>
            <div dangerouslySetInnerHTML={{__html: html}} />
        </div>);
    }
}