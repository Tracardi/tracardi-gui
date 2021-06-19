import React from "react";
import "./SocialButton.css";

export default function SocialButton({icon, title, link, onClick, className}) {
    const css = (className) ? className : "SocialButton";

    return <a className={css} href={link} onClick={onClick}>
        <span className="Icon">{icon}</span>
        {title && <span className="Label">{title}</span>}
    </a>
}