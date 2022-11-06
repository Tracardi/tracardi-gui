import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventValidationDetails from "../elements/details/EventValidationDetails";
import EventValidationForm from "../elements/forms/EventValidationForm";

export default function EventValidation() {

    const urlFunc = useCallback((query) => ('/event-validators' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventValidationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventValidationDetails id={id} onDeleteComplete={close}/>, []);

    const cards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<FlowNodeIcons icon="validator" size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "validator"}}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Event validation"
        description="Event validation allows the check of event payload before it reaches the database and workflow."
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        buttomLabel="New validation"
        buttonIcon={<FlowNodeIcons icon="validator"/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New validation"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
