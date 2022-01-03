import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import SquareCard from "../elements/lists/cards/SquareCard";
import EventValidationForm from "../elements/forms/EventValidationForm";
import {BsFolderCheck} from "react-icons/bs";
import EventValidationDetails from "../elements/details/EventValidationDetails";

export default function EventValidation() {

    const urlFunc= useCallback((query) => ('/event/validation-schemas/by_tag'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventValidationForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventValidationDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    const flows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<BsFolderCheck size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Event data validation"
        description="List of validations. You may filter this list by validation schema name in the upper search box."
        urlFunc={urlFunc}
        cardFunc={flows}
        buttomLabel="New validation"
        buttonIcon={<BsFolderCheck size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Validation schema details"
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New validation schema"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
