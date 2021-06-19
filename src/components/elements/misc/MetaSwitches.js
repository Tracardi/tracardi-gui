import React from "react";
import {ThemeProvider} from "@material-ui/styles";
import Switch from "@material-ui/core/Switch";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {request} from "../../../remote_api/uql_api_endpoint";

export default function MetaSwitches({index, id, meta}) {

    const [enabled, setEnabled] = React.useState(meta.enabled);
    const [hidden, setHidden] = React.useState(meta.hidden);
    const [readOnly, setReadOnly] = React.useState(meta.readOnly);
    const [missingPlugins, setMissingPlugins] = React.useState(meta.missingPlugins);

    const switchTheme = createMuiTheme({
        typography: {
            body1: {
                fontSize: 14,
            }
        },
        palette: {
            primary: {
                main: '#19857b',
            }
        }
    })

    const none = () => {
    }
    const onError = () => {
    }

    const toggle = (ev, type, onChange) => {
        const value = ev.target.checked;
        let config = {
            url: '/' + index + '/' + id,
            method: "put",
            data: {
                doc: {
                    metadata: {

                    }
                }
            }
        }
        config.data.doc.metadata[type] = value
        request(
            config,
            none,
            onError,
            () => {
                onChange(value)
            }
        );
    }

    const onEnabled = (ev) => {
        toggle(ev, "enabled", setEnabled);
    }

    const onReadOnly = (ev) => {
        toggle(ev, "readOnly", setReadOnly);
    }

    const onHidden = (ev) => {
        toggle(ev, "hidden", setHidden);
    }

    const onMissingPlugins = (ev) => {
        toggle(ev, "missingPlugins", setMissingPlugins);
    }

    const SwitchRow = ({label, value, onChange}) => {
        return <div className="RuleSwitch">
            <div className="RuleSwitchLabel">{label}</div>
            <Switch checked={value} onChange={onChange} color="primary" size="small"/>
        </div>
    }

    return <ThemeProvider theme={switchTheme}>
        <SwitchRow label="Enabled" value={enabled} onChange={onEnabled}/>
        <SwitchRow label="Read only" value={readOnly} onChange={onReadOnly}/>
        <SwitchRow label="Hidden" value={hidden} onChange={onHidden}/>
        <SwitchRow label="Missing plugins" value={missingPlugins} onChange={onMissingPlugins}/>
    </ThemeProvider>
}