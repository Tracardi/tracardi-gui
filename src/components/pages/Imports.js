import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsFileEarmarkArrowUp} from "react-icons/bs";
import ImportDetails from "../elements/details/ImportDetails";
import ImportForm from "../elements/forms/ImportForm";


export default function Imports () {

    const urlFunc = useCallback((query) => ('/imports' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ImportForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ImportDetails id={id} onClose={close}/>, []);

    const destinations = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<BsFileEarmarkArrowUp size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Imports"
        urlFunc={urlFunc}
        cardFunc={destinations}
        buttomLabel="New import"
        buttonIcon={<BsFileEarmarkArrowUp size={20}/>}
        drawerDetailsTitle="Import details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New import"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />
}