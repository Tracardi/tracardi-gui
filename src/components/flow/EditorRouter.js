import React, {Suspense} from "react";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import PropTypes from "prop-types";

const Editor = React.lazy(() => import("./editors/ConfigEditor.js"));

export default function EditorRouter({type, config, manual, onConfigSave}) {

    return <Suspense fallback={<CenteredCircularProgress/>}>
        <Editor config={config}
                manual={manual}
                onConfig={onConfigSave}/>
    </Suspense>
}

EditorRouter.propTypes = {
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    manual: PropTypes.string,
    onConfigSave: PropTypes.func.isRequired
};