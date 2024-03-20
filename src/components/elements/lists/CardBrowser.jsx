import React, {useContext, useState} from "react";
import './CardBrowser.css';
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import envs from "../../../envs";
import {DataContext} from "../../AppBox";
import TableRows from "./TableRows";


const CardBrowser = ({
                         label,
                         description,
                         urlFunc,
                         buttonLabel = null,
                         buttonIcon,
                         drawerDetailsWidth = 600,
                         detailsFunc,
                         drawerAddWidth = 600,
                         addFunc,
                         className,
                         noDataInfo,
                         deleteEndpoint,
                         deploymentTable,
                         icon,
                         descriptionFunc,
                         actionFunc,
                         forceMode
                     }) => {

    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [query, setQuery] = useState(null);
    const [refresh, setRefresh] = useState(0);

    const context = useContext(DataContext);

    const handleFilter = (query) => {
        setQuery(query);
    }

    const handleCloseAdd = () => {
        setDisplayAddForm(false);
        setRefresh(refresh + 1)
    }

    const handleOpenAdd = () => {
        setDisplayAddForm(true)
    }

    return <div className="CardBrowser">

        <FilterAddForm
            style={{margin: "0 20px", marginTop: 5}}
            textFieldLabel="Type to filter"
            buttonLabel={buttonLabel}
            buttonIcon={buttonIcon}
            onFilter={handleFilter}
            onAdd={handleOpenAdd}
            disableNewButton={!envs.allowUpdatesOnProduction}
        />

        <TuiForm style={{margin: 20, marginTop: 0}}>
            <TuiFormGroup fitHeight={true}>
                <TuiFormGroupHeader header={label} description={description}/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <section className={className} style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
                            <TableRows
                                url={urlFunc(query)}
                                noDataInfo={noDataInfo}
                                dataContext={`${label}-${context}`}
                                deleteEndpoint={deleteEndpoint}
                                deploymentTable={deploymentTable}
                                icon={icon}
                                drawerDetailsWidth={drawerDetailsWidth}
                                detailsFunc={detailsFunc}
                                listRefresh={refresh}
                                descriptionFunc={descriptionFunc}
                                forceMode={forceMode}
                                actionFunc={actionFunc}
                            />
                        </section>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>

        <FormDrawer
            width={drawerAddWidth}
            onClose={handleCloseAdd}
            open={displayAddForm}>
            {addFunc && buttonLabel && addFunc(handleCloseAdd)}
        </FormDrawer>

    </div>
}

export default CardBrowser;
