import React from 'react';
import { makeStyles } from "tss-react/mui";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import JsonBrowser from "../../elements/misc/JsonBrowser";

const useStyles = makeStyles()((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: 15,
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: 15
    }
}));

export default function DebugContextAccordions({profile, event, session}) {
    const { classes } = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"

                >
                    <Typography className={classes.heading}>Profile data</Typography>
                    <Typography className={classes.secondaryHeading}>Profile data object</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <JsonBrowser data={profile}/>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>Event data</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Event data object
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <JsonBrowser data={event}/>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography className={classes.heading}>Session</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Session data object
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <JsonBrowser data={session}/>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}