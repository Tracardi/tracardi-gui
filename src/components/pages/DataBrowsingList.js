import React, {useContext, useState} from "react";
import "./DataAnalytics.css";
import "./DataBrowsingList.css";
import DetailsObjectList from "../elements/lists/DetailsObjectList";
import ServerContextBar from "../context/ServerContextBar";
import {DataContext} from "../AppBox";
import {BsThreeDotsVertical} from "react-icons/bs";
import DropDownMenu from "../menu/DropDownMenu";
import FormDrawer from "../elements/drawers/FormDrawer";
import {objectMapEntries} from "../../misc/mappers";

function Extensions({extensions}) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerExtension, setDrawerExtension] = useState(null);

    const extensionOptions = extensions ? objectMapEntries(extensions, (key) => {
        return () => {
            setDrawerExtension(key)
            setOpenDrawer(true)
        }
    }) : null

    if (extensions === null) {
        return ""
    }

    return <>

        {extensionOptions && <div style={{position: "absolute", right: 10}}>
            <DropDownMenu icon={<BsThreeDotsVertical size={18}/>}
                          progress={false}
                          options={extensionOptions}/>
        </div>}
        <FormDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} width={800}>
            {drawerExtension in extensions && React.createElement(extensions[drawerExtension])}
        </FormDrawer>
    </>
}

export default function DataBrowsingList(
    {
        label,
        children,
        onLoadDataRequest,
        onLoadDetails,
        timeField,
        timeFieldLabel,
        filterFields,
        initQuery,
        displayDetails,
        detailsDrawerWidth,
        displayChart = true,
        refreshInterval = 0,
        rowDetails = null,
        localContext,
        onLocalContextChange,
        ExtensionDropDown

    }) {

    const globalProductionContext = useContext(DataContext)

    return <section className="DataBrowsingList">
        <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
            {!globalProductionContext && <ServerContextBar context={localContext}
                                                           onContextChange={onLocalContextChange}/>}
            {ExtensionDropDown && <Extensions extensions={ExtensionDropDown}/>}
        </div>

        {displayChart === true && <div className="Chart">
            {children}
        </div>}
        <div className="Data">
            <DetailsObjectList
                label={label}
                onLoadRequest={onLoadDataRequest(initQuery)}
                onLoadDetails={onLoadDetails}
                filterFields={filterFields}
                timeField={timeField}
                timeFieldLabel={timeFieldLabel}
                displayDetails={displayDetails}
                detailsDrawerWidth={detailsDrawerWidth}
                refreshInterval={refreshInterval}
                rowDetails={rowDetails}
            />
        </div>

    </section>
}