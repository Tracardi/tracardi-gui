import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export default function AccordionItems({items=[]}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState("item0");

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    console.log(items);
    return (
        <div className={classes.root}>
            {Array.isArray(items) && items.length>0 && items.map((item, idx)=>{
                return <Accordion key={idx} expanded={expanded === item.id} onChange={handleChange(item.id)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className={classes.heading}>{item.title}</Typography>
                        <Typography className={classes.secondaryHeading}>{item.description}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {item.content}
                    </AccordionDetails>
                </Accordion>
            })}
        </div>
    );
}