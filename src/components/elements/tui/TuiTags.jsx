import Chip from "@mui/material/Chip";
import React from "react";

export default function TuiTags({tags, style, size="medium"}) {
    return Array.isArray(tags) && tags.map((tag, index) => <Chip label={tag} key={index} style={style} size={size}/>)
}