import React, {useEffect, useState} from "react";
import { Collapse } from '@mui/material';

export default function RevealContent({children, after=0}) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(after === 0) {
            setOpen(true);
        } else {
            const timer = setTimeout(() => {
                setOpen(true);
            }, after);

            return () => clearTimeout(timer);
        }

    }, []);

    return <Collapse in={open} style={{width: "100%"}}>
        {children}
    </Collapse>
}

