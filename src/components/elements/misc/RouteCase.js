import React from "react";
import PropTypes from 'prop-types';
import {useLocation} from "react-router-dom";

export function RouteSwitch({children}) {

    const location = useLocation();

    return React.Children.map(children,
        (child) => {
            if (location.pathname.substring(0, child.props.link.length) === child.props.link) {
                return child;
            }
            return "";
        }
    );
}

export function RouteCase({children}) {
    return children;
}

RouteCase.propTypes = {
    link: PropTypes.string.isRequired,
}