import Chip from "@mui/material/Chip";
import React from "react";

export default function TuiTags({tags}) {
    return Array.isArray(tags) && tags.map((tag, index) => <Chip label={tag} key={index} style={{marginLeft: 5, marginTop: 10}}/>)
}