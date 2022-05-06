import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {AiOutlineDownload} from "react-icons/ai";
import BatchDetails from "../elements/details/BatchDetails";
import BatchForm from "../elements/forms/BatchForm";


export default function Batches () {

    const urlFunc = useCallback((query) => ('/batches' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <BatchForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <BatchDetails id={id} onClose={close}/>, []);

    const destinations = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<AiOutlineDownload size={45}/>}
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
        label="Data batches"
        urlFunc={urlFunc}
        cardFunc={destinations}
        buttomLabel="New batch"
        buttonIcon={<AiOutlineDownload size={20}/>}
        drawerDetailsTitle="Batch details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New batch"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />
}