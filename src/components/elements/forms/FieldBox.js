import Box from "@mui/material/Box";
import React from "react";

export function FieldBox({children}) {
    return <Box
        sx={{
            '& > :not(style)': {
                m: 1,
            },
        }}
    >
        {children}
    </Box>
}