import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    }
}));

export default function DebugContextAccordions({profile, event, session}) {
    const classes = useStyles();
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
                    <ObjectInspector data={profile} theme={theme} expandLevel={5}/>
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
                    <ObjectInspector data={event} theme={theme} expandLevel={5}/>
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
                    <ObjectInspector data={session} theme={theme} expandLevel={5}/>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}