import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import "./ModuleRegisterForm.css";
import {request} from "../../remote_api/uql_api_endpoint";

export default function ModuleRegisterForm({onReady}) {

    const defaultHelperText = "eg. app.process_engine.action.copy_property_action"

    const [module, setModule] = useState("");
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState(defaultHelperText)
    const onEnterPressed = (module) => {
        request({
                url: '/flow/action/plugin/register?module='+module,
                method: 'post'
            },
            () => {
                setError(false);
                setHelperText(defaultHelperText)
            },
            (e) => {
                if(e) {
                    setError(true);
                    setHelperText(e[0].msg)
                }
            },
            (response) => {
                if(response && onReady) {
                    onReady(response)
                }
            }
        )
    }

    const handleKeyPress = (ev) => {
        if (ev.key === 'Enter' && typeof (onEnterPressed) !== "undefined") {
            onEnterPressed(ev.target.value);
            ev.preventDefault();
        }

    };

    function render() {
        return <div className="ModuleRegisterForm">
            <div className="ModuleName">Type module you would like to register and hit ENTER to register.</div>
            <TextField id="tasks" label="Action module"
                       value={module}
                       onChange={(ev) => {
                           setModule(ev.target.value)
                       }}
                       error={error}
                       helperText={helperText}
                       onKeyPressCapture={handleKeyPress}
                       size="small"
                       fullWidth
                       style={{width: "100%"}}
            />
        </div>
    }

    return render();
}