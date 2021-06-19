import React from "react";
import PropTypes from 'prop-types';

export function SwitchCase({children, caseId}) {
    return React.Children.map(children,
        (child) => {
            if (caseId === child.props.id) {
                return child;
            }
            return "";
        }
    );
}

export function Case({children}) {
    return children;
}

SwitchCase.propTypes = {
    caseId: PropTypes.string.isRequired,
}
Case.propTypes = {
    id: PropTypes.string.isRequired,
}