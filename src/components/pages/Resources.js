import React, {useCallback} from "react";
import ResourceDetails from "../elements/details/ResourceDetails";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscRadioTower} from "@react-icons/all-files/vsc/VscRadioTower";
import SourceForm from "../elements/forms/ResourceForm";


export default function Resources() {

    const urlFunc = useCallback((query) => ('/resources/by_tag' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <SourceForm onClose={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ResourceDetails id={id} onDeleteComplete={close}/>, []);

    const sources = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<VscRadioTower size={45}/>}
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
        label="Resources"
        urlFunc={urlFunc}
        cardFunc={sources}
        buttomLabel="New resource"
        buttonIcon={<VscRadioTower size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Resource details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New resource"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
