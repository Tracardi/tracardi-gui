import React from "react";
import SourceDetails from "../elements/details/SourceDetails";
import SquareCard from "../elements/lists/cards/SquareCard";
import SourceAddForm from "../elements/forms/SourceAddForm";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscRadioTower} from "@react-icons/all-files/vsc/VscRadioTower";


export default function Sources() {

    const sources = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup">
                <header key={index}>{category}</header>
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
        urlFunc={(query) => ('/sources/by_tag' + ((query) ? "?query=" + query : ""))}
        cardFunc={sources}
        buttomLabel="New source"
        buttonIcon={<VscRadioTower size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Source details"
        drawerDetailsWidth={800}
        detailsFunc={(id, close) => <SourceDetails id={id} onDeleteComplete={close}/>}
        drawerAddTitle="New source"
        drawerAddWidth={800}
        addFunc={(close) => <SourceAddForm/>}
    />
}
