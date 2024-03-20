import "ace-builds/src-noconflict/mode-json";

export class CustomHighlightRules extends window.ace.require(
    "ace/mode/text_highlight_rules"
).TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
                start: [
                    {
                        token: "reference",
                        regex: '["][`]?(profile|memory|session|payload|event|flow)[@][a-zA-Z0-9\\._\\-]+[`]?["]'
                    },
                    {
                        token: "variable",
                        regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)'
                    }, {
                        token: "string",
                        regex: '"',
                        next: "string"
                    }, {
                        token: "constant.numeric",
                        regex: "0[xX][0-9a-fA-F]+\\b"
                    }, {
                        token: "constant.numeric",
                        regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                    }, {
                        token: "constant.language.boolean",
                        regex: "(?:true|false)\\b"
                    }, {
                        token: "text",
                        regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                    }, {
                        token: "comment",
                        regex: "\\/\\/.*$"
                    }, {
                        token: "comment.start",
                        regex: "\\/\\*",
                        next: "comment"
                    }, {
                        token: "paren.lparen",
                        regex: "[[({]"
                    }, {
                        token: "paren.rparen",
                        regex: "[\\])}]"
                    }, {
                        token: "punctuation.operator",
                        regex: /[,]/
                    }, {
                        token: "text",
                        regex: "\\s+"
                    }
                ],
                "string": [
                    {
                        token: "constant.language.escape",
                        regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/
                    }, {
                        token: "string",
                        regex: '"|$',
                        next: "start"
                    }, {
                        defaultToken: "string"
                    }
                ],
                "comment": [
                    {
                        token: "comment.end",
                        regex: "\\*\\/",
                        next: "start"
                    }, {
                        defaultToken: "comment"
                    }
                ]
            };
    }
}

export default class ReferencedJsonMode extends window.ace.require("ace/mode/json")
    .Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
}